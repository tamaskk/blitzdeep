/** Shared vertex shader for the flat scene quads (background, glow, text). */
export const quadVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/** Background: vertical blue gradient, #0B6BFF → #2F86FF at 60% → #CFE3FF. */
export const backgroundFragment = /* glsl */ `
varying vec2 vUv;

const vec3 TOP    = vec3(0.043, 0.420, 1.000); // #0B6BFF
const vec3 MID    = vec3(0.184, 0.525, 1.000); // #2F86FF
const vec3 BOTTOM = vec3(0.812, 0.890, 1.000); // #CFE3FF

void main() {
  float t = 1.0 - vUv.y; // 0 at the top
  vec3 col = t < 0.6 ? mix(TOP, MID, t / 0.6) : mix(MID, BOTTOM, (t - 0.6) / 0.4);
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Soft radial glow sprite drawn behind the orb. */
export const glowFragment = /* glsl */ `
uniform float uOpacity;
varying vec2 vUv;

void main() {
  float d = clamp(length(vUv - 0.5) * 2.0, 0.0, 1.0);
  float a = 0.9 * pow(1.0 - d, 1.6) * uOpacity;
  gl_FragColor = vec4(0.745, 0.882, 1.0, a); // rgb(190, 225, 255)
}
`;

/** Headline / subtitle / buttons: a premultiplied 2D-canvas texture. */
export const textFragment = /* glsl */ `
uniform sampler2D uMap;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(uMap, vUv);
}
`;
