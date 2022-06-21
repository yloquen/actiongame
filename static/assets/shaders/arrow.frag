precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform vec2 dimensions;
uniform vec4 inputPixel;

uniform float time;
uniform vec3 barCoef;


void main()
{
	vec4 texSample = texture2D(uSampler, vTextureCoord);
	vec4 comp1 = vec4(0.2, 0.14, 0.0, 0.7);
	vec4 comp2 = vec4(0.9255, 0.7647, 0.4588, 1.0);
	float bars = (sin(vTextureCoord.y * barCoef.x + vTextureCoord.x * barCoef.y - time * barCoef.z) + 1.05) * 9.0;
	bars = clamp(bars, 0.0, 1.0 )* texSample.r;
	gl_FragColor = comp1 * texSample.g + comp2 * bars;
}