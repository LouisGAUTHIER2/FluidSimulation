#define GLSLIFY 1
// Common uniforms
uniform float iTime;

varying float height;
varying vec2 vUV;

/*
 * The main program
 */
void main() {
	height = cos(iTime+sqrt((position.x-100.0)*(position.x-100.0) + (position.z-100.0)*(position.z-100.0)));

	vUV = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(0,height,0), 1.0);
}