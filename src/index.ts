import vert from './basic.vert';

const spir_v: Uint32Array = vert;
console.log(spir_v.length);

const setup_canvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.backgroundColor = '#EEEEEE';
    document.body.append(canvas);
    return canvas;
};

const canvas_resize = (canvas: HTMLCanvasElement): void => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

(async (): Promise<void> => {
    const canvas = setup_canvas();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context: GPUCanvasContext = canvas.getContext('gpupresent') as any;
    console.log(context);
    console.log(navigator.gpu);

    window.addEventListener(
        'resize',
        () => {
            canvas_resize(canvas);
        },
        false,
    );
})();
