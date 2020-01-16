
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var vert = new Uint32Array( new Uint8Array(  atob("AwIjBwADAQAIAAgAHwAAAAAAAAARAAIAAQAAAAsABgABAAAAR0xTTC5zdGQuNDUwAAAAAA4AAwAAAAAAAQAAAA8ACQAAAAAABAAAAG1haW4AAAAACQAAAAsAAAATAAAAFgAAAAMAAwACAAAAwgEAAAUABAAEAAAAbWFpbgAAAAAFAAUACQAAAG91dENvbG9yAAAAAAUABAALAAAAaW5Db2xvcgAFAAYAEQAAAGdsX1BlclZlcnRleAAAAAAGAAYAEQAAAAAAAABnbF9Qb3NpdGlvbgAGAAcAEQAAAAEAAABnbF9Qb2ludFNpemUAAAAABgAHABEAAAACAAAAZ2xfQ2xpcERpc3RhbmNlAAYABwARAAAAAwAAAGdsX0N1bGxEaXN0YW5jZQAFAAMAEwAAAAAAAAAFAAQAFgAAAGluUG9zAAAARwAEAAkAAAAeAAAAAAAAAEcABAALAAAAHgAAAAEAAABIAAUAEQAAAAAAAAALAAAAAAAAAEgABQARAAAAAQAAAAsAAAABAAAASAAFABEAAAACAAAACwAAAAMAAABIAAUAEQAAAAMAAAALAAAABAAAAEcAAwARAAAAAgAAAEcABAAWAAAAHgAAAAAAAAATAAIAAgAAACEAAwADAAAAAgAAABYAAwAGAAAAIAAAABcABAAHAAAABgAAAAMAAAAgAAQACAAAAAMAAAAHAAAAOwAEAAgAAAAJAAAAAwAAACAABAAKAAAAAQAAAAcAAAA7AAQACgAAAAsAAAABAAAAFwAEAA0AAAAGAAAABAAAABUABAAOAAAAIAAAAAAAAAArAAQADgAAAA8AAAABAAAAHAAEABAAAAAGAAAADwAAAB4ABgARAAAADQAAAAYAAAAQAAAAEAAAACAABAASAAAAAwAAABEAAAA7AAQAEgAAABMAAAADAAAAFQAEABQAAAAgAAAAAQAAACsABAAUAAAAFQAAAAAAAAA7AAQACgAAABYAAAABAAAAKwAEAAYAAAAYAAAAAACAPyAABAAdAAAAAwAAAA0AAAA2AAUAAgAAAAQAAAAAAAAAAwAAAPgAAgAFAAAAPQAEAAcAAAAMAAAACwAAAD4AAwAJAAAADAAAAD0ABAAHAAAAFwAAABYAAABRAAUABgAAABkAAAAXAAAAAAAAAFEABQAGAAAAGgAAABcAAAABAAAAUQAFAAYAAAAbAAAAFwAAAAIAAABQAAcADQAAABwAAAAZAAAAGgAAABsAAAAYAAAAQQAFAB0AAAAeAAAAEwAAABUAAAA+AAMAHgAAABwAAAD9AAEAOAABAA==").split("").map(m => m.charCodeAt(0))).buffer);

const spir_v = vert;
console.log(spir_v.length);
const setup_canvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.backgroundColor = '#EEEEEE';
    document.body.append(canvas);
    return canvas;
};
const canvas_resize = (canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
(async () => {
    const canvas = setup_canvas();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context = canvas.getContext('gpupresent');
    console.log(context);
    console.log(navigator.gpu);
    window.addEventListener('resize', () => {
        canvas_resize(canvas);
    }, false);
})();
