precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform vec2 dimensions;
uniform vec4 inputPixel;

uniform float time;


float rand(vec2 p)
{
	vec3 p2 = vec3(p.xy, 1.0);
	return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 31758.5453123);
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


float plasma(vec2 uv, float t)
{
	float t2 = t * .05;
	mat2 rotMatrix = mat2(cos(t2), -sin(t2), sin(t2), cos(t2));

	vec2 uv2 = rotMatrix * vec2(1.0 - uv.x, uv.y);
	vec2 uv3 = rotMatrix * uv;

	float c1 =
	noise(uv3 * (7.0 + sin(t * .5)) + (t) * .7) +
	noise(uv2 * (12.0 + sin(t * .3) * 1.5));

	c1 *= .66;
	return c1;
}


void main()
{
	vec2 uv = (vTextureCoord * inputPixel.xy) / dimensions;
	uv.y = 1.0 - uv.y;
	vec4 texCol = texture2D(uSampler, vTextureCoord);

	float c = plasma(uv, time * 1.2);
	float d = (1.5 - uv.y) * 3.0 - time * 1.5;
	d = d + c;

	vec4 finalColor = vec4(d);

	if (d > 1.4)
	{
		finalColor = texCol;
	}
	else if (d > 1.0)
	{
		const vec3 burnColor = vec3(0.0, 0.0, 0.0);
		finalColor.xyz = mix(texCol.xyz, burnColor, clamp((1.4-d) * 6., 0.0, 1.0));
		finalColor.a = texCol.a;
	}
	else
	{
		finalColor = vec4(1.0, max(0., .5 * d), .1, texCol.a) * d * texCol.a;
	}

	gl_FragColor = finalColor;
}