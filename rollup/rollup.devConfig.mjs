import fs from 'fs';
import { announceVersion, lint, metadataBuilder } from './plugins.js';
// import strip from '@rollup/plugin-strip';
import css from 'rollup-plugin-import-css';
import { string } from 'rollup-plugin-string';

const catcherBlock = fs.readFileSync('./rollup/catcher.js', 'utf8').split('undefined');

export default {
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
        // strip({
        //     functions: [ 'console.log', 'console.warn' ]
        // }),
        lint(),
        announceVersion(true)
    ]
};