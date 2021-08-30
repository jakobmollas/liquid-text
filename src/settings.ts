export class Settings {
    showDiagnostics: boolean = false;
    density: number = 3;
    text: string = "♥";
    viscosity: number = 0.75;
    liveliness: number = 0.5;
    pointerRadius: number = 100 / (window.devicePixelRatio ?? 1);
}