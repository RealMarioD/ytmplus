import * as fs from 'fs';
import { ESLint } from 'eslint';

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
            }, 500);
        }
    };
}

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
export function metadataBuilder() {
    const metadata = `// ==UserScript==
// @name         ${pkg.metaname}
// @version      ${pkg.version}
// @author       ${pkg.author}
// @license      ${pkg.license}
// @namespace    ${pkg.namespace}
// @updateURL    ${pkg.updateURL}
// @downloadURL  ${pkg.downloadURL}
// @description  ${pkg.description}
// @match        ${pkg.match}
// @icon         ${pkg.icon}
// @require      ${pkg.require}
${pkg.grant.map(perm => `// @grant        ${perm}`).join('\n')}
// ==/UserScript==
const vNumber = 'v${pkg.version}';
`;
    return metadata;
}

export function announceVersion(dev) {
    console.log('\x1b[33m%s\x1b[0m', `BUILDING: ${dev === true ? 'DEV' : 'RELEASE'} | VERSION ${pkg.version}`);
}