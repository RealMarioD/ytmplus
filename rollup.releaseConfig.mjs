import fs from 'fs';
import { announceVersion, lint, metadataBuilder } from './plugins.js';
import strip from '@rollup/plugin-strip';
import css from 'rollup-plugin-import-css';
import { string } from 'rollup-plugin-string';

const catcherBlock = fs.readFileSync('./catcher.js', 'utf8').split('undefined');

export default {
    onwarn: (warning) => { // We can ignore circular dependecies
        if(warning.code === 'CIRCULAR_DEPENDENCY') return;
        console.warn('\x1b[33m%s\x1b[0m', warning.message);
    },
    input: 'src/index.js',
    output: {
        file: 'dist/ytmplus.user.js',
        format: 'iife',
        name: 'ytmplus',
        banner: () => (metadataBuilder() + catcherBlock[0]),
        footer: () => (catcherBlock[1]),
    },
    plugins: [
        css(),
        string({
            include: 'src/settingsMenu/ui/ytmpTitle.svg',
        }),
        strip({
            functions: [ 'console.log', 'console.error', 'console.warn' ]
        }),
        lint(),
        announceVersion(false)
    ]
};