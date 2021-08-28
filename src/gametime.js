export class GameTime {
    _deltaTime = 0;
    _deltaTimeFactor = 0;
    _lastTimestamp = 0;

    update() {
        this._deltaTime = this._lastTimestamp ? performance.now() - this._lastTimestamp : 0;
        this._lastTimestamp = performance.now();
        this._deltaTimeFactor = this._deltaTime / 1000;
    }

    get deltaTime() {
        return this._deltaTime;
    }

    get deltaTimeFactor() {
        return this._deltaTimeFactor;
    }
}