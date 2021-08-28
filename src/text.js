export class Text {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    setText(text, density, stageWidth, stageHeight) {
        this.canvas.width = stageWidth;
        this.canvas.height = stageHeight;

        const myText = text;
        const fontWidth = 700;
        let fontSize = 800;
        //const fontName = "Hind";
        let fontPos;

        this.ctx.clearRect(0, 0, stageWidth, stageHeight);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
        this.ctx.textBaseline = "middle";

        while (true) {
            this.ctx.font = `${fontWidth} ${fontSize}px arial`;
            fontPos = this.ctx.measureText(myText);
            if (fontPos.width < (stageWidth * 0.9))
                break;

            fontSize *= 0.9;
        }

        this.ctx.fillText(
            myText,
            (stageWidth - fontPos.width) / 2,
            fontPos.actualBoundingBoxAscent +
            fontPos.actualBoundingBoxDescent +
            ((stageHeight - fontSize) / 2)
        );

        return this.dotPos(density, stageWidth, stageHeight);
    }

    dotPos(density, stageWidth, stageHeight) {
        const imageData = this.ctx.getImageData(0, 0, stageWidth, stageHeight).data;

        const particles = [];
        let i = 0;
        let width = 0;
        let pixel;

        for (let height = 0; height < stageHeight; height += density) {
            ++i;
            const slide = (i % 2) == 0;
            width = 0;
            if (slide == 1) {
                width += 6;
            }

            for (width; width < stageWidth; width += density) {
                const pixelIndex = ((width + (height * stageWidth)) * 4) - 1;
                pixel = imageData[pixelIndex];
                if (pixel != 0 &&
                    width > 0 &&
                    width < stageWidth &&
                    height > 0 &&
                    height <= stageHeight) {
                    particles.push({ x: width, y: height });
                }
            }
        }

        return particles;
    }
}