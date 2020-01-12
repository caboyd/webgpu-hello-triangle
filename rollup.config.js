// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
    input: 'src/index.ts',
    preserveModules: true,
    output: {
        dir: 'build',
        entryFileNames: '[name].mjs',
        format: 'esm',
    },

    plugins: [
        typescript({
            //https://github.com/vladshcherbin/rollup-plugin-copy/issues/16
            objectHashIgnoreUnknownHack: true,
        }),
        copy({
            targets: [{src: 'src/index.html', dest: 'build'}],
        }),
        serve('build'),
        livereload({
            watch: 'build',
        }),
    ],
};
