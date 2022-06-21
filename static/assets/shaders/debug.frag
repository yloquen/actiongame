precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform vec2 dimensions;
uniform vec4 inputPixel;


void main()
{
	vec2 uv = (vTextureCoord * inputPixel.xy) / dimensions;
	gl_FragColor = vec4(uv.x, 0.0, 0.0, 1.0);
}