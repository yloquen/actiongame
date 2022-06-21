precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform vec2 dimensions;
uniform vec4 inputPixel;

uniform float time;
uniform float randSeed;
uniform vec4 color;


float rand(vec2 n)
{
	return fract(sin(dot(n, vec2(12.9898, 12.1414))) * 83758.5453 + 12345.666 + randSeed);
}


float noise(vec2 n)
{
	const vec2 unit = vec2(0.0, 1.0);
	vec2 n_floor = floor(n);
	vec2 n_smoothstep = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	float mix1 = mix(rand(n_floor), rand(n_floor + unit.xy), n_smoothstep.y);
	float mix2 = mix(rand(n_floor + unit.yx), rand(n_floor + unit.yy), n_smoothstep.y);
	return mix(mix1, mix2, n_smoothstep.x);
}


float fire(vec2 uv, float t)
{
	float c = noise(uv * 3.0 - t) + noise(uv * 11.0 - t);
	return c;
}


void main()
{
    vec4 texSample = texture2D(uSampler, vTextureCoord);
    float c = fire(vTextureCoord, time * .7) * .5 + texSample.r * 2.0 - 1.0;
    c = clamp(c, 0.0, 1.0);
    gl_FragColor = vec4(c * color.r, c * color.g, c * color.b, c);
}