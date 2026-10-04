/**
 * GPU fluid simulation passes, after Pavel Dobryakov's WebGL-Fluid-Simulation
 * (MIT). Only the velocity field is simulated — there is no dye. The velocity
 * texture is what the composite pass uses to refract the scene.
 *
 * Velocity is stored in sim texels per second in the RG channels.
 */

/** Full-screen triangle; precomputes the four neighbour UVs for the stencils. */
export const fluidVertex = /* glsl */ `
uniform vec2 texelSize;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/** Splat: add a gaussian blob of velocity at the pointer position. */
export const splatFragment = /* glsl */ `
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec2 point;
uniform vec2 force;
uniform float radius;
varying vec2 vUv;

void main() {
  vec2 p = vUv - point;
  p.x *= aspectRatio;
  vec2 splat = exp(-dot(p, p) / radius) * force;
  vec2 base = texture2D(uTarget, vUv).xy;
  gl_FragColor = vec4(base + splat, 0.0, 1.0);
}
`;

/** Advection: carry the field along itself, with per-frame decay. */
export const advectionFragment = /* glsl */ `
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float decay;
varying vec2 vUv;

void main() {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  gl_FragColor = vec4(decay * texture2D(uSource, coord).xy, 0.0, 1.0);
}
`;

/** Curl (vorticity) of the velocity field. */
export const curlFragment = /* glsl */ `
uniform sampler2D uVelocity;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

void main() {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}
`;

/** Vorticity confinement: push energy back into the swirls. */
export const vorticityFragment = /* glsl */ `
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

void main() {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;

  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;

  vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
  gl_FragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}
`;

/** Divergence of the velocity field (walls reflect). */
export const divergenceFragment = /* glsl */ `
uniform sampler2D uVelocity;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

void main() {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;

  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }

  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}
`;

/** Scale a field (used to fade last frame's pressure as a warm start). */
export const clearFragment = /* glsl */ `
uniform sampler2D uTexture;
uniform float value;
varying vec2 vUv;

void main() {
  gl_FragColor = value * texture2D(uTexture, vUv);
}
`;

/** One Jacobi iteration of the pressure solve. */
export const pressureFragment = /* glsl */ `
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

void main() {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}
`;

/** Subtract the pressure gradient, leaving a divergence-free field. */
export const gradientSubtractFragment = /* glsl */ `
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

void main() {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

/**
 * Composite: refract the rendered scene through the velocity field.
 *  - UVs are offset against the flow, so content smears where the cursor went
 *  - red and blue are sampled slightly apart along the flow (chromatic split)
 *  - fast-moving areas get a small brightness lift
 * A dead zone on the displacement guarantees a crisp image once the fluid
 * settles; `uAmount` = 0 bypasses the effect entirely.
 */
export const compositeFragment = /* glsl */ `
uniform sampler2D uScene;
uniform sampler2D uVelocity;
uniform vec2 texelSize;
uniform float uStrength;
uniform float uAmount;
varying vec2 vUv;

void main() {
  if (uAmount <= 0.0) {
    gl_FragColor = vec4(texture2D(uScene, vUv).rgb, 1.0);
    return;
  }

  // Texels/second → UV offset.
  vec2 disp = texture2D(uVelocity, vUv).xy * texelSize * uStrength * 4.0 * uAmount;
  float mag = length(disp);
  disp *= smoothstep(0.0002, 0.0012, mag);
  disp *= min(1.0, 0.06 / max(mag, 0.0001));
  mag = length(disp);

  vec2 uv = vUv - disp;
  vec2 split = disp * 0.15;
  vec3 col = vec3(
    texture2D(uScene, uv - split).r,
    texture2D(uScene, uv).g,
    texture2D(uScene, uv + split).b
  );
  col += vec3(min(mag * 3.0, 0.08));

  gl_FragColor = vec4(col, 1.0);
}
`;
