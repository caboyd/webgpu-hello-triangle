// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
const glslang = require('@webgpu/glslang/dist/node-devel/glslang')();
import glsl from 'rollup-plugin-glsl';

function inline_glslang() {
    return {
        name: 'inline_glslang',

        transform(source, id) {
            if (/\.(vert|vs)$/.test(id)) {
                const glsl = glslang.compileGLSL(source, 'vertex');
                const buffer = Buffer.from(glsl.buffer);
                const src = buffer.toString('base64');
                const result = `export default new Uint32Array( new Uint8Array(  atob("${src}").split("").map(m => m.charCodeAt(0))).buffer)`;
                return result;
            }
            return null;
        },
    };
}

function copy_compile_glsland(){
    return {
        name: 'compy_compile_glslang',

    }
}

export default {
    input: ['src/index.ts'],
    output: {
        dir: 'build',
        entryFileNames: '[name].mjs',
        format: 'esm',
    },
    extensions: ['.ts, .frag, .vert'],

    plugins: [
        inline_glslang(),
        typescript(),

        copy({
            targets: [{src: 'src/index.html', dest: 'build'}],
        }),
        serve('build'),
        livereload({
            watch: 'build',
        }),
    ],
};
