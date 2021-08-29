import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';

export function createBlurFilter(): PIXI.Filter {
    const filter = new PIXI.filters.BlurFilter();
    filter.blur = 10;
    filter.autoFit = true;

    return filter;
}

export function createBloomFilter(): PIXI.Filter {
    const filter = new Filters.BloomFilter();
    filter.blur = 20;

    return filter;
}

export function createThresholdColorizerFilter(): PIXI.Filter {
    // pixel shader used to sharpen and colorize image (after getting blurred).
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
                if (color.a > threshold) {
                    gl_FragColor = vec4(mr, vTextureCoord.y * mg, mb, 1.0);
                    //gl_FragColor = color;
                } else {
                    gl_FragColor = vec4(vec3(0.0), 0);  // transparent
                }
            }
        `;

    // Data to be passed to the shader
    const uniformsData = {
        threshold: 0.5,
        mr: 255.0 / 255.0,
        mg: 255.0 / 255.0,
        mb: 0.0 / 255.0
    }

    const thresholdFilter = new PIXI.Filter("", fragSource, uniformsData);
    return thresholdFilter;
}