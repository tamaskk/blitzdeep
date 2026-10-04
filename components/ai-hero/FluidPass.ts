import * as THREE from "three";
import {
  fluidVertex,
  splatFragment,
  advectionFragment,
  curlFragment,
  vorticityFragment,
  divergenceFragment,
  clearFragment,
  pressureFragment,
  gradientSubtractFragment,
  compositeFragment,
} from "./shaders/fluid.glsl";

const SIM_SCALE = 0.25; // sim runs at 1/4 of the hero's CSS resolution
const SPLAT_RADIUS = 0.0025;
const SPLAT_FORCE = 6000;
const CURL = 20;
const PRESSURE_ITERATIONS = 20;
const PRESSURE_FADE = 0.8;
// Per-frame (60fps) velocity decay. Slightly stronger than Dobryakov's default
// so ripples are gone within about a second.
const VELOCITY_DECAY = 0.96;
const DISTORTION_STRENGTH = 0.012;
// With no splats for this long the field is cleared and the pass is bypassed.
const IDLE_SECONDS = 3;

type DoubleTarget = {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
  swap: () => void;
};

/**
 * Cursor-driven fluid simulation plus the post-process that warps the scene
 * with it. Call `splat` on pointer movement, `step` once per frame, then
 * `render` with the scene texture to draw the final image to the screen.
 */
export class FluidPass {
  private renderer: THREE.WebGLRenderer;
  private enabled: boolean;
  private scene = new THREE.Scene();
  private camera = new THREE.Camera();
  private mesh: THREE.Mesh;
  private texel = new THREE.Vector2(1, 1);
  private aspect = 1;
  private idle = IDLE_SECONDS;

  private velocity!: DoubleTarget;
  private pressure!: DoubleTarget;
  private divergence!: THREE.WebGLRenderTarget;
  private curl!: THREE.WebGLRenderTarget;

  private splatMat: THREE.ShaderMaterial;
  private advectionMat: THREE.ShaderMaterial;
  private curlMat: THREE.ShaderMaterial;
  private vorticityMat: THREE.ShaderMaterial;
  private divergenceMat: THREE.ShaderMaterial;
  private clearMat: THREE.ShaderMaterial;
  private pressureMat: THREE.ShaderMaterial;
  private gradientMat: THREE.ShaderMaterial;
  private compositeMat: THREE.ShaderMaterial;

  constructor(renderer: THREE.WebGLRenderer, enabled: boolean) {
    this.renderer = renderer;
    // Rendering to half-float targets needs one of these extensions.
    this.enabled =
      enabled &&
      (renderer.extensions.has("EXT_color_buffer_float") ||
        renderer.extensions.has("EXT_color_buffer_half_float"));

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3)
    );
    this.mesh = new THREE.Mesh(geometry);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);

    const material = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>) =>
      new THREE.ShaderMaterial({
        vertexShader: fluidVertex,
        fragmentShader,
        uniforms: { texelSize: { value: this.texel }, ...uniforms },
        depthTest: false,
        depthWrite: false,
        blending: THREE.NoBlending,
      });

    this.splatMat = material(splatFragment, {
      uTarget: { value: null },
      aspectRatio: { value: 1 },
      point: { value: new THREE.Vector2() },
      force: { value: new THREE.Vector2() },
      radius: { value: SPLAT_RADIUS },
    });
    this.advectionMat = material(advectionFragment, {
      uVelocity: { value: null },
      uSource: { value: null },
      dt: { value: 0 },
      decay: { value: 1 },
    });
    this.curlMat = material(curlFragment, { uVelocity: { value: null } });
    this.vorticityMat = material(vorticityFragment, {
      uVelocity: { value: null },
      uCurl: { value: null },
      curl: { value: CURL },
      dt: { value: 0 },
    });
    this.divergenceMat = material(divergenceFragment, { uVelocity: { value: null } });
    this.clearMat = material(clearFragment, {
      uTexture: { value: null },
      value: { value: PRESSURE_FADE },
    });
    this.pressureMat = material(pressureFragment, {
      uPressure: { value: null },
      uDivergence: { value: null },
    });
    this.gradientMat = material(gradientSubtractFragment, {
      uPressure: { value: null },
      uVelocity: { value: null },
    });
    this.compositeMat = material(compositeFragment, {
      uScene: { value: null },
      uVelocity: { value: null },
      uStrength: { value: DISTORTION_STRENGTH },
      uAmount: { value: 0 },
    });
  }

  /** (Re)allocate the simulation targets for a hero of `width` × `height` CSS px. */
  resize(width: number, height: number) {
    this.aspect = width / height;
    if (!this.enabled) return;

    const w = Math.max(16, Math.round(width * SIM_SCALE));
    const h = Math.max(16, Math.round(height * SIM_SCALE));
    this.disposeTargets();
    this.texel.set(1 / w, 1 / h);

    const target = () =>
      new THREE.WebGLRenderTarget(w, h, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: false,
      });
    const double = (): DoubleTarget => {
      const pair = { read: target(), write: target(), swap: () => {} };
      pair.swap = () => {
        const tmp = pair.read;
        pair.read = pair.write;
        pair.write = tmp;
      };
      return pair;
    };

    this.velocity = double();
    this.pressure = double();
    this.divergence = target();
    this.curl = target();
    this.idle = IDLE_SECONDS;
  }

  /**
   * Inject velocity along a pointer segment. Coordinates are hero UVs with the
   * origin bottom-left. Long segments are split so fast moves leave a
   * continuous trail instead of separate dots.
   */
  splat(u0: number, v0: number, u1: number, v1: number) {
    if (!this.enabled) return;

    let dx = u1 - u0;
    let dy = v1 - v0;
    if (dx === 0 && dy === 0) return;
    const steps = Math.min(6, Math.max(1, Math.ceil(Math.hypot(dx, dy) / 0.02)));

    // Keep the force isotropic on non-square heroes.
    if (this.aspect < 1) dx *= this.aspect;
    else dy /= this.aspect;
    const scale = SPLAT_FORCE / Math.sqrt(steps);

    const u = this.splatMat.uniforms;
    u.aspectRatio.value = this.aspect;
    u.radius.value = this.aspect > 1 ? SPLAT_RADIUS * this.aspect : SPLAT_RADIUS;
    u.force.value.set(dx * scale, dy * scale);

    for (let i = 1; i <= steps; i++) {
      const k = i / steps;
      u.point.value.set(u0 + (u1 - u0) * k, v0 + (v1 - v0) * k);
      u.uTarget.value = this.velocity.read.texture;
      this.pass(this.splatMat, this.velocity.write);
      this.velocity.swap();
    }
    this.idle = 0;
  }

  /** Advance the simulation by `dt` seconds. */
  step(dt: number) {
    if (!this.enabled || this.idle >= IDLE_SECONDS) return;

    this.idle += dt;
    if (this.idle >= IDLE_SECONDS) {
      // Fully settled: zero the fields so nothing lingers.
      this.clear(this.velocity.read);
      this.clear(this.velocity.write);
      this.clear(this.pressure.read);
      this.clear(this.pressure.write);
      return;
    }

    this.curlMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.pass(this.curlMat, this.curl);

    this.vorticityMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.vorticityMat.uniforms.uCurl.value = this.curl.texture;
    this.vorticityMat.uniforms.dt.value = dt;
    this.pass(this.vorticityMat, this.velocity.write);
    this.velocity.swap();

    this.divergenceMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.pass(this.divergenceMat, this.divergence);

    this.clearMat.uniforms.uTexture.value = this.pressure.read.texture;
    this.pass(this.clearMat, this.pressure.write);
    this.pressure.swap();

    this.pressureMat.uniforms.uDivergence.value = this.divergence.texture;
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      this.pressureMat.uniforms.uPressure.value = this.pressure.read.texture;
      this.pass(this.pressureMat, this.pressure.write);
      this.pressure.swap();
    }

    this.gradientMat.uniforms.uPressure.value = this.pressure.read.texture;
    this.gradientMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.pass(this.gradientMat, this.velocity.write);
    this.velocity.swap();

    this.advectionMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectionMat.uniforms.uSource.value = this.velocity.read.texture;
    this.advectionMat.uniforms.dt.value = dt;
    this.advectionMat.uniforms.decay.value = Math.pow(VELOCITY_DECAY, dt * 60);
    this.pass(this.advectionMat, this.velocity.write);
    this.velocity.swap();
  }

  /** Draw `sceneTexture` to the screen, distorted by the current velocity field. */
  render(sceneTexture: THREE.Texture) {
    const active = this.enabled && this.idle < IDLE_SECONDS;
    const u = this.compositeMat.uniforms;
    u.uScene.value = sceneTexture;
    u.uVelocity.value = active ? this.velocity.read.texture : null;
    u.uAmount.value = active ? 1 : 0;
    this.pass(this.compositeMat, null);
  }

  dispose() {
    this.disposeTargets();
    this.mesh.geometry.dispose();
    [
      this.splatMat,
      this.advectionMat,
      this.curlMat,
      this.vorticityMat,
      this.divergenceMat,
      this.clearMat,
      this.pressureMat,
      this.gradientMat,
      this.compositeMat,
    ].forEach((m) => m.dispose());
  }

  private pass(material: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null) {
    this.mesh.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  private clear(target: THREE.WebGLRenderTarget) {
    this.renderer.setRenderTarget(target);
    this.renderer.clear(true, false, false);
  }

  private disposeTargets() {
    if (!this.velocity) return;
    [
      this.velocity.read,
      this.velocity.write,
      this.pressure.read,
      this.pressure.write,
      this.divergence,
      this.curl,
    ].forEach((t) => t.dispose());
  }
}
