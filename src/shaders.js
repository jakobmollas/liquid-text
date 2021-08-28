import * as PIXI from 'pixi.js';

export function createBlurFilter() {
    const filter = new PIXI.filters.BlurFilter();
    filter.blur = 10;
    filter.autoFit = true;

    return filter;
}

export function createThresholdFilter() {
    // pixel shader used to sharpen image (after getting blurred).
    const fragSource = `
            precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform float threshold;
            uniform float mr;
            uniform float mg;
            uniform float mb;
            void main(void) {
                vec4 color = texture2D(uSampler, vTextureCoord);
                vec3 mcolor = vec3(mr, mg, mb);
                if (color.a > threshold) {
                    gl_FragColor = vec4(mcolor, 1.0);
                    //gl_FragColor = color;
                } else {
                    // transparent
                    gl_FragColor = vec4(vec3(0.0), 0);
                }
            }
        `;

    // Create custom data top be passed to the shader
    const uniformsData = {
        threshold: 0.5,
        mr: 255.0 / 255.0,
        mg: 0.0 / 255.0,
        mb: 0.0 / 255.0
    }

    const thresholdFilter = new PIXI.Filter(null, fragSource, uniformsData);
    return thresholdFilter;
}