precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float intensity;
uniform vec4 color_vector;

void main(void)
{
	vec4 texSample = texture2D(uSampler, vTextureCoord);
	vec4 tmp = texSample + vec4(intensity) * vec4(color_vector);
	tmp = tmp * vec4(clamp(texSample.w * 10.0, 0.0, 1.0));
	gl_FragColor = tmp;
}