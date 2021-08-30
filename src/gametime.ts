export class GameTime {
    private _deltaTime: number = 0;
    private _deltaTimeFactor: number = 0;
    private _lastTimestamp: number = 0;
    private _fps: number = 0;

    update() {
        this._deltaTime = this._lastTimestamp ? performance.now() - this._lastTimestamp : 0;
        this._lastTimestamp = performance.now();
        this._deltaTimeFactor = this.deltaTime / 1000;
        this._fps = this._deltaTime > 0 ? 1000 / this._deltaTime : 0;
    }

    get deltaTime(): number {
        return this._deltaTime;
    }

    get deltaTimeFactor(): number {
        return this._deltaTimeFactor;
    }

    get fps(): number {
        return this._fps;
    }
}