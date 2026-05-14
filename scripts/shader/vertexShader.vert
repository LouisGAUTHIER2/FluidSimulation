#define GLSLIFY 1
// Common uniforms
uniform float iTime;
uniform float iMaxHeight;
uniform sampler2D iHeightmap;
uniform vec3 iResolution;

varying float height;
varying vec2 vUV;

/*
 * The main program
 */
void main() {
	height = (
		texture2D(iHeightmap, uv+vec2(iResolution.x*0.5f, iResolution.y*0.5f)).x+
		texture2D(iHeightmap, uv+vec2(iResolution.x*-0.5f, iResolution.y*0.5f)).x+
		texture2D(iHeightmap, uv+vec2(iResolution.x*0.5f, iResolution.y*-0.5f)).x+
		texture2D(iHeightmap, uv+vec2(iResolution.x*-0.5f, iResolution.y*-0.5f)).x)/4.0f;

	vUV = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(0,height*iMaxHeight,0), 1.0);
}