import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

const replacePlugin = replace({
    preventAssignment: true,
    values: {
        __lib_version__: pkg.version
    }
})

export default [
    {
        input: 'src/index.ts',
        output: {
            format: 'es', file: 'dist/index.mjs'
        },
        plugins: [
            typescript({tsconfig: './tsconfig.json'}),
            replacePlugin,
            nodeResolve(),
            terser(),
        ],
    },
    {
        input: 'dist/build/index.d.ts',
        output: {
            file: 'types/index.d.ts',
            format: 'es'
        },
        plugins: [
            replacePlugin,
            dts(),
        ]
    }
];
