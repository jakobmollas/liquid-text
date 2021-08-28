export function TextToPoints(canvas, text, pixelsPerPoint, stageWidth, stageHeight) {
    const ctx = canvas.getContext("2d");

    canvas.width = stageWidth;
    canvas.height = stageHeight;

    const fontWidth = 700;
    const fontName = "Hind";
    let fontSize = 10;
    let metrics;

    ctx.clearRect(0, 0, stageWidth, stageHeight);
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.textBaseline = "middle";

    // find a good size for the text
    while (true) {
        ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
        metrics = ctx.measureText(text);
        if (metrics.width > (stageWidth * 0.90))
            break;

        fontSize *= 1.1;
    }

    // write text - the resulting image will be used to calculate points
    ctx.fillText(
        text,
        (stageWidth - metrics.width) / 2,
        metrics.actualBoundingBoxAscent +
        metrics.actualBoundingBoxDescent +
        ((stageHeight - fontSize) / 2)
    );

    return createPoints(ctx, pixelsPerPoint);
}

function createPoints(ctx, pixelsPerPoint) {
    const points = [];
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;

    // sample image data and create points for pixels with data
    for (let height = 0; height < ctx.canvas.height; height += pixelsPerPoint) {
        for (let width = 0; width < ctx.canvas.width; width += pixelsPerPoint) {
            const pixelAlpha = imageData[((width + (height * ctx.canvas.width)) * 4) - 1];

            if (pixelAlpha != 0)
                points.push({ x: width, y: height });
        }
    }

    return points;
}