precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform vec2 dimensions;
uniform vec4 inputPixel;

uniform float time;


void main()
{
	vec4 texColor = texture2D(uSampler, vTextureCoord);
	vec4 colDiff = vec4(1.0, 1.0, 1.0, 1.0) - texColor;

	float l = (1.0 - length(colDiff) / 1.732);

	float d1 = length(vTextureCoord - vec2(0.4, 0.2));
	float w1 = (1.0 + sin(d1 * 10.0 + time)) * 0.5;

	float d2 = length(vTextureCoord - vec2(0.1, 0.7));
	float w2 = (1.0 + sin(d2 * 7.0 + time * 1.2)) * 0.5;

	float d3 = length(vTextureCoord - vec2(0.8, 0.5));
	float w3 = (1.0 + sin(d3 * 4.0 + time * 0.7)) * 0.5;

	float c = (w1 + w2 + w3) * 0.25 * l;

	float r = 0.75;

	gl_FragColor = vec4(texColor.r * r + c, texColor.g * r + c, texColor.b * r + c, 1.0);
}