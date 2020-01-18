// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
const glslang = require('@webgpu/glslang/dist/node-devel/glslang')();

function inline_glslang() {
    return {
        name: 'inline_glslang',

        transform(source, id) {
            const shader_stage = /\.(vert|vs)$/.test(id)
                ? 'vertex'
                : /\.(frag|fs)$/.test(id)
                ? 'fragment'
                : /\.(comp)$/.test(id)
                ? 'compute'
                : undefined;
            if (shader_stage === undefined) return;
            const byte_code = glslang.compileGLSL(source, shader_stage);
           // console.log(byte_code);
            const buffer = Buffer.from(byte_code.buffer);
            //console.log(buffer)
            const base64 = buffer.toString('base64');
           // console.log(base64);
            const result = `export default new Uint32Array( new Uint8Array(  atob("${base64}").split("").map(m => m.charCodeAt(0))).buffer)`;
            return result;
        },
    };
}

export default {
    input: ['src/index.ts'],
    output: {
        dir: 'build',
        entryFileNames: '[name].mjs',
        format: 'esm',
    },
    extensions: ['.ts, .frag, .vert'],
    external: ['@webgpu/types/dist/index'],

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
