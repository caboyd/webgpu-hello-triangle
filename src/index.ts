const setup_canvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.backgroundColor = '#EEEEEE';
    document.body.append(canvas);
    return canvas;
};

const canvas = setup_canvas();

const canvas_resize = (): void => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

window.addEventListener('resize', canvas_resize, false);
