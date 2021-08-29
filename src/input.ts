export class Input {
    data: PointerInput;

    constructor() {
        this.data = new PointerInput(0, 0, 100 / (window.devicePixelRatio ?? 1));

        document.addEventListener("pointermove", this.pointerMove.bind(this), false);
        document.addEventListener("touchstart", this.touchStart.bind(this), false);
        document.addEventListener("touchend", this.touchEnd.bind(this), false);
    }

    pointerMove(e: PointerEvent) {
        this.data.x = e.clientX;
        this.data.y = e.clientY;
    }

    touchStart(e: TouchEvent) {
        if (e.touches?.length > 0) {
            this.data.x = e.touches[0].clientX;
            this.data.y = e.touches[0].clientY;
        }
    }

    touchEnd() {
        this.data.x = -1;
        this.data.y = -1;
    }
}

export class PointerInput {
    x: number;
    y: number;
    private _radius: number

    constructor(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this._radius = radius;
    }

    get radius(): number { return this._radius; }
}