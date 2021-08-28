export class Input {
    constructor() {
        this.mouse = {
            x: 0,
            y: 0,
            radius: 100
        };

        document.addEventListener("pointermove", this.pointerMove.bind(this), false);
        document.addEventListener("touchstart", this.touchStart.bind(this), false);
        document.addEventListener("touchend", this.touchEnd.bind(this), false);
    }

    pointerMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    touchStart(e) {
        if (e.touches?.length > 0) {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }
    }

    touchEnd() {
        this.mouse.x = -1;
        this.mouse.y = -1;
    }
}