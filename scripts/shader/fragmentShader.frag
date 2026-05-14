#include <common>

uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D iTexture;

varying float height;
varying vec2 vUV;

// By iq: https://www.shadertoy.com/user/iq
// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = vUV;

    vec4 colorTexture = texture2D(iTexture, uv);

    fragColor = colorTexture;
}
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}