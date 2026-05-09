#define GLSLIFY 1
// Common uniforms
uniform float iTime;

/*
 * The main program
 */
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(cos(iTime),cos(iTime),cos(iTime)), 1.0);
}