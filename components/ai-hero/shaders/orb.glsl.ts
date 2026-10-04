import { noise } from "./noise.glsl";

/**
 * Orb vertex pass. Keeps the object-space position for the surface pattern (so
 * the marbling rotates with the mesh) and the view-space normal for lighting
 * (so the light stays put). In "voice" mode (`uLevel` > 0) vertices are pushed
 * along the normal by noise, making the orb pulse as it talks.
 */
export const orbVertex = /* glsl */ `
uniform float uFlow;
uniform float uLevel;
varying vec3 vObjPos;
varying vec3 vNormal;
${noise}

void main() {
  vObjPos = position;
  vNormal = normalize(normalMatrix * normal);

  vec3 p = position;
  if (uLevel > 0.0) {
    p += normal * snoise(position * 2.5 + uFlow * 3.0) * 0.05 * uLevel;
  }
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

/**
 * Orb fragment pass: domain-warped fBm mapped to a coral palette, then lit.
 * `uFlow` is accumulated time (not raw time) so the swirl speed can change
 * smoothly — fast during the intro and while "talking", slow at idle.
 */
export const orbFragment = /* glsl */ `
uniform float uFlow;
uniform float uOpacity;
varying vec3 vObjPos;
varying vec3 vNormal;
${noise}

const vec3 DEEP_RED = vec3(0.761, 0.149, 0.110); // #C2261C
const vec3 CORAL    = vec3(0.933, 0.353, 0.263); // #EE5A43
const vec3 SALMON   = vec3(0.969, 0.604, 0.502); // #F79A80
const vec3 PALE     = vec3(1.000, 0.827, 0.769); // #FFD3C4
const vec3 RIM_DARK = vec3(0.557, 0.102, 0.078); // #8E1A14
const vec3 RIM_BLUE = vec3(0.612, 0.784, 1.000); // #9CC8FF

void main() {
  vec3 p = normalize(vObjPos) * 0.55;
  float t = uFlow;

  // Two warping passes: q bends the domain, r bends it again using q.
  vec3 q = vec3(
    fbm(p + vec3(0.0, 0.0, t)),
    fbm(p + vec3(5.2, 1.3, -t)),
    fbm(p + vec3(1.7, 9.2, t * 0.7))
  );
  vec3 r = vec3(
    fbm(p + 1.3 * q + vec3(1.7, 9.2, 0.5 * t)),
    fbm(p + 1.3 * q + vec3(8.3, 2.8, -0.6 * t)),
    fbm(p + 1.3 * q + vec3(3.1, 4.7, 0.4 * t))
  );

  // Stretching one axis turns the blobs into streaky, flowing bands.
  float n = fbm(vec3(p.x, p.y * 1.8, p.z) + 1.6 * r) * 0.5 + 0.5;
  float bands = sin((n + r.x * 0.6) * 7.0) * 0.5 + 0.5;
  n = mix(n, bands, 0.3);

  vec3 col = mix(DEEP_RED, CORAL, smoothstep(0.15, 0.45, n));
  col = mix(col, SALMON, smoothstep(0.45, 0.70, n));
  col = mix(col, PALE, smoothstep(0.72, 0.95, n));

  // Lighting. The camera is orthographic, so the view vector is constant.
  vec3 N = normalize(vNormal);
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L = normalize(vec3(-0.5, 0.7, 0.6)); // top-left

  float lambert = dot(N, L) * 0.5 + 0.5; // wrapped, for a soft falloff
  col *= mix(0.62, 1.1, lambert);

  // Broad Blinn-Phong highlight near the top.
  vec3 H = normalize(L + V);
  col += vec3(1.0) * pow(max(dot(N, H), 0.0), 10.0) * 0.4;

  // Fresnel: darken the rim so it reads as a solid ball, then a faint blue
  // reflection of the background on the very edge.
  float fresnel = 1.0 - max(dot(N, V), 0.0);
  col = mix(col, RIM_DARK, pow(fresnel, 2.5) * 0.55);
  col += RIM_BLUE * 0.15 * pow(fresnel, 4.0);

  gl_FragColor = vec4(col, uOpacity);
}
`;
