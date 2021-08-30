import { Point } from "./point";

export class Input {
    private position: Point;
    private active: boolean = false;

    constructor() {
        this.position = new Point(0, 0);

        document.addEventListener("pointermove", this.pointerMove.bind(this), false);
        document.addEventListener("touchstart", this.touchStart.bind(this), false);
        document.addEventListener("touchend", this.touchEnd.bind(this), false);
    }

    get x(): number { return this.position.x; }
    get y(): number { return this.position.y; }
    get isActive(): boolean { return this.active; }

    private pointerMove(e: PointerEvent) {
        this.position.x = e.clientX;
        this.position.y = e.clientY;
        this.active = true;
    }

    private touchStart(e: TouchEvent) {
        if (e.touches?.length > 0) {
            this.position.x = e.touches[0].clientX;
            this.position.y = e.touches[0].clientY;
            this.active = true;
        }
    }

    private touchEnd() {
        this.position.x = -1;
        this.position.y = -1;
        this.active = false;
    }
}