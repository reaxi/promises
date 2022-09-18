import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import command from 'rollup-plugin-command';

const inputDir = './src';
const outputDir = './dist';
const declarationDir = `${outputDir}/_declaration`;

const plugins = [
    command(
        `yarn tsc --emitDeclarationOnly --declaration --declarationDir ${declarationDir}`,
        { wait: true, once: true }
    ),
    typescript({ tsconfig: './tsconfig.json' }),
    commonjs(),
    nodeResolve(),
    command('yarn minify'), // <- if you want to minify code (with terser)
    del({
        targets: outputDir,
    }),
];

const external = ['/node_modules/']; // external packages

const emitTypes = {
    // emitting types (bundled)
    input: `${declarationDir}/index.d.ts`,
    output: [{ file: `${outputDir}/index.d.ts`, format: 'es' }],
    plugins: [
        dts(),
        del({
            targets: `${declarationDir}`,
            hook: 'buildEnd',
        }),
    ],
};

export default [
    {
        input: `${inputDir}/index.ts`,
        output: {
            file: `${outputDir}/index.js`,
            format: 'commonjs',
        },
        plugins,
        external,
    },
    /* {... more inputs / outputs} */
    emitTypes,
];
