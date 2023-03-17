import fs from 'fs';
import { fuckGMConfig, lint } from './plugins.js';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/ytmplus.user.js',
        format: 'iife',
        name: 'ytmplus',
        banner: () => (fs.readFileSync('./metadata.js', 'utf8')),
        globals: {
            GM_config: 'src/GM_config.js'
        }
    },
    plugins: [
        fuckGMConfig(),
        lint()
    ]
};