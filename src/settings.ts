export class Settings {
    animate: boolean = true;
    showDiagnostics: boolean = false;
    density: number = 3;
    text: string = "YUM";
    viscosity: number = 0.9;
    liveliness: number = 0.5;
    pointerRadius: number = 100 / (window.devicePixelRatio ?? 1);
}