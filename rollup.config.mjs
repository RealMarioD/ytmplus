import fs from 'fs';
import { checkDebug, fuckGMConfig, lint, metadataBuilder } from './plugins.js';

const catcherBlock = fs.readFileSync('./catcher.js', 'utf8').split('undefined');

export default {
    onwarn: (warning) => { // We can ignore circular dependecies, it's required(?) for ESLint
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
        globals: {
            GM_config: 'src/GM_config.js'
        }
    },
    plugins: [
        checkDebug(),
        fuckGMConfig(),
        lint()
    ]
};