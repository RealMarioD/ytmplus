import * as fs from 'fs';
import { ESLint } from 'eslint';

let fixedVars;
export function fuckGMConfig() { // Rollup creates "GM_config$1" and idk why, this plugin deletes "$1"
    return {
        name: 'fuckGMConfig',
        buildEnd(err) {
            setTimeout(() => {
                console.log('\x1b[34m%s\x1b[0m', 'fuckGMConfig: Working...');
                if(err) return console.error(err);
                fs.readFile('dist/ytmplus.user.js', 'utf-8', (err, data) => {
                    if(err) return console.error(err);
                    fixedVars = data.replace(/GM_config\$1/g, 'GM_config');
                    fs.writeFile('dist/ytmplus.user.js', fixedVars, (err2) => {
                        if(err2) return console.error(err2);
                        console.log('\x1b[32m%s\x1b[0m', 'fuckGMConfig: Job done.');
                    });
                });
            }, 500);
        }
    };
}

const eslint = new ESLint({ fix: true });
export function lint() {
    return {
        name: 'lint',
        buildEnd(err) {
            setTimeout(async () => {
                console.log('\x1b[34m%s\x1b[0m', 'lint: Working...');
                if(err) return console.error(err);
                const results = await eslint.lintFiles(['dist/ytmplus.user.js']);
                await ESLint.outputFixes(results);
                const formatter = await eslint.loadFormatter('stylish');
                const resultText = formatter.format(results);
                console.log(resultText);
                console.log('\x1b[32m%s\x1b[0m', 'lint: Job done.');
            }, 1000);
        }
    };
}