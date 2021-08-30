# liquid-text

Based on a [YouTube tutorial](https://www.youtube.com/watch?v=HMQ9fEX28fk) created by Jongmin Kim.

Created as an introduction to Pixi.js and using TypeScript with a third party library (including type defs). 
Unfortunately Parcel does not use the TypeScript compiler but merely strips TypeScript annotations without checking types or transpile in any way.
Maybe there is a way to do that in the future but for now the added support available in the IDE is valuable.

- `npm run dev` - start dev server (clean caches, copy static assets etc.)
- `npm run build` - create build, does NOT use scope hoisting since that seems to mess up resulting code

⚠️ __Note:__ Since no TypeScript compilation is done, more advanced TS features like [Parameter Properties](https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties) cannot be used.

- Using [PIXI.js](https://pixijs.com/) (via npm) to render via WebGL (via HTML Canvas)
- Uses fragment shaders for post-processing
- Uses [Parcel](https://parceljs.org/) to bundle it up and run dev server, bundles everything except static assets into a single html file
- Uses [dat.GUI](https://github.com/dataarts/dat.gui) for live UI settings
- Mouse/touch is used to interact with the drawing

Live: https://jakobmollas.github.io/liquid-text/

![screenshot](screenshot.png "Screenshot")

Simulation details:
- Render offscreen image based on text via a HTML Canvas
- Sample resulting image; extract coordinates for pixels containing data, skip transparent pixels
- For each extracted coordinate, create a particle, add everything a PIXI.ParticleContainer
- Animate - use mouse/touch input to affect particle velocity and make sure each particle strives to return to its original position
- Apply a few shaders to first smear out (blur) particles, then run a threshold filter to sharpen it up again and add some colorization, finally apply some bloom
- Basically, use particles and blur to create a metaball simulation
