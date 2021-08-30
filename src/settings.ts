export class Settings {
    showDiagnostics: boolean = false;
    density: number = 4;
    text: string = "♥";
    viscosity: number = 0.9;
    liveliness: number = 0.5;
    pointerRadius: number = 100 / (window.devicePixelRatio ?? 1);
}