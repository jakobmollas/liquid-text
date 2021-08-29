# liquid-text

Based on a [YouTube tutorial](https://www.youtube.com/watch?v=HMQ9fEX28fk) created by Jongmin Kim.

Created as an introduction to Pixi.js. 
Refactored and modified from the original.
I am planning to port it to TypeScript to explore using Pixi.js via TypeScript.

- Using [PIXI.js](https://pixijs.com/) (via npm) to render via WebGL (via HTML Canvas)
- Uses shaders for post-processing
- Uses [Parcel](https://parceljs.org/) to bundle it up and run dev server
- Mouse/touch is used to interact with the drawing

Live: https://jakobmollas.github.io/liquid-text/

![screenshot](screenshot.png "Screenshot")

Simulation details:
- Render offscreen image based on text via HTML Canvas
- Sample resulting image, extract coordinates with content
- For each extracted coordinate, create a particle and add it all to a PIXI.ParticleContainer
- Animate - use pointer input to affect particle velocity but make sure each particle tries to return to its original position
- Apply a few shaders to first smear out (blur) particles, then run a threshold filter to sharpen it up again and add some colorization, finally apply some bloom
- Basically, use particles and blur to create a metaball simulation
