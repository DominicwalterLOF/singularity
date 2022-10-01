
const ConvolutionShader = {
    defines: {
        'KERNEL_SIZE_FLOAT': '25.0',
        'KERNEL_SIZE_INT': '25'
    },
    uniforms: {
        'tDiffuse': {
            value: null
        },
        'uImageIncrement': {
            value: new THREE.Vector2( 0.001953125, 0.0 )
        },
        'cKernel': {
            value: []
        }
    },
    vertexShader:
/* glsl */
`
    uniform vec2 uImageIncrement;
    varying vec2 vUv;
    void main() {
        vUv = uv - ( ( KERNEL_SIZE_FLOAT - 1.0 ) / 2.0 ) * uImageIncrement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
    fragmentShader:
/* glsl */
`
    uniform float cKernel[ KERNEL_SIZE_INT ];
    uniform sampler2D tDiffuse;
    uniform vec2 uImageIncrement;
    varying vec2 vUv;
    void main() {
        vec2 imageCoord = vUv;
        vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );
        for( int i = 0; i < KERNEL_SIZE_INT; i ++ ) {
            sum += texture2D( tDiffuse, imageCoord ) * cKernel[ i ];
            imageCoord += uImageIncrement;
        }
        gl_FragColor = sum;
    }`,
    buildKernel: function ( sigma ) {

        // We lop off the sqrt(2 * pi) * sigma term, since we're going to normalize anyway.
        const kMaxKernelSize = 25;
        let kernelSize = 2 * Math.ceil( sigma * 3.0 ) + 1;
        if ( kernelSize > kMaxKernelSize ) kernelSize = kMaxKernelSize;
        const halfWidth = ( kernelSize - 1 ) * 0.5;
        const values = new Array( kernelSize );
        let sum = 0.0;

        for ( let i = 0; i < kernelSize; ++ i ) {

            values[ i ] = gauss( i - halfWidth, sigma );
            sum += values[ i ];

        } // normalize the kernel


        for ( let i = 0; i < kernelSize; ++ i ) values[ i ] /= sum;

        return values;

    }
};

function gauss( x, sigma ) {

    return Math.exp( - ( x * x ) / ( 2.0 * sigma * sigma ) );

}

THREE.ConvolutionShader = ConvolutionShader;

const CopyShader = {
    uniforms: {
        'tDiffuse': {
            value: null
        },
        'opacity': {
            value: 1.0
        }
    },
    vertexShader:
/* glsl */
`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
    fragmentShader:
/* glsl */
`
    uniform float opacity;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
        gl_FragColor = texture2D( tDiffuse, vUv );
        gl_FragColor.a *= opacity;
    }`
};

THREE.CopyShader = CopyShader;

const LuminosityHighPassShader = {
    shaderID: 'luminosityHighPass',
    uniforms: {
        'tDiffuse': {
            value: null
        },
        'luminosityThreshold': {
            value: 1.0
        },
        'smoothWidth': {
            value: 1.0
        },
        'defaultColor': {
            value: new THREE.Color( 0x000000 )
        },
        'defaultOpacity': {
            value: 0.0
        }
    },
    vertexShader:
/* glsl */
`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
    fragmentShader:
/* glsl */
`
    uniform sampler2D tDiffuse;
    uniform vec3 defaultColor;
    uniform float defaultOpacity;
    uniform float luminosityThreshold;
    uniform float smoothWidth;
    varying vec2 vUv;
    void main() {
        vec4 texel = texture2D( tDiffuse, vUv );
        vec3 luma = vec3( 0.299, 0.587, 0.114 );
        float v = dot( texel.xyz, luma );
        vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );
        float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );
        gl_FragColor = mix( outputColor, texel, alpha );
    }`
};

THREE.LuminosityHighPassShader = LuminosityHighPassShader;


function ScreenShake() {

	return {

		// When a function outside ScreenShake handle the camera, it should
		// always check that ScreenShake.enabled is false before.
		enabled: false,

		_timestampStart: undefined,

		_timestampEnd: undefined,

		_startPoint: undefined,

		_endPoint: undefined,



		// update(camera) must be called in the loop function of the renderer,
		// it will re-position the camera according to the requested shaking.
		update: function update(camera) {
			if ( this.enabled == true ) {
				const now = Date.now();
				if ( this._timestampEnd > now ) {
					let interval = (Date.now() - this._timestampStart) / 
						(this._timestampEnd - this._timestampStart) ;
					this.computePosition( camera, interval );
				} else {
					camera.position.copy(this._startPoint);
					this.enabled = false;
				};
			};
		},



		// This initialize the values of the shaking.
		// vecToAdd param is the offset of the camera position at the climax of its wave.
		shake: function shake(camera, vecToAdd, milliseconds) {
			this.enabled = true ;
			this._timestampStart = Date.now();
			this._timestampEnd = this._timestampStart + milliseconds;
			this._startPoint = new THREE.Vector3().copy(camera.position);
			this._endPoint = new THREE.Vector3().addVectors( camera.position, vecToAdd );
		},




		computePosition: function computePosition(camera, interval) {

			// This creates the wavy movement of the camera along the interval.
			// The first bloc call this.getQuadra() with a positive indice between
			// 0 and 1, then the second call it again with a negative indice between
			// 0 and -1, etc. Variable position will get the sign of the indice, and
			// get wavy.
			if (interval < 0.4) {
				var position = this.getQuadra( interval / 0.4 );
			} else if (interval < 0.7) {
				var position = this.getQuadra( (interval-0.4) / 0.3 ) * -0.6;
			} else if (interval < 0.9) {
				var position = this.getQuadra( (interval-0.7) / 0.2 ) * 0.3;
			} else {
				var position = this.getQuadra( (interval-0.9) / 0.1 ) * -0.1;
			}
			
			// Here the camera is positioned according to the wavy 'position' variable.
			camera.position.lerpVectors( this._startPoint, this._endPoint, position );
		},

		// This is a quadratic function that return 0 at first, then return 0.5 when t=0.5,
		// then return 0 when t=1 ;
		getQuadra: function getQuadra(t) {
			return 9.436896e-16 + (4*t) - (4*(t*t)) ;
		}

	};

};

const VerticalBlurShader = {
    uniforms: {
        'tDiffuse': {
            value: null
        },
        'v': {
            value: 1.0 / 512.0
        }
    },
    vertexShader:
/* glsl */
`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
    fragmentShader:
/* glsl */
`
    uniform sampler2D tDiffuse;
    uniform float v;
    varying vec2 vUv;
    void main() {
        vec4 sum = vec4( 0.0 );
        sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
        sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
        sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
        sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
        sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
        sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
        sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
        sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
        sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;
        gl_FragColor = sum;
    }`
};

THREE.VerticalBlurShader = VerticalBlurShader;