import { injectStyle } from '../functions/backend/injectStyle';
import cogFrame from '../css/cogFrame.css';
import { injectElement } from '../functions/backend/injectElement';
import { ytmpConfig } from '../ytmpConfig';

export async function createCogFrame() {
    const ytmSettingsSvg = document.getElementById('settings').outerHTML; // Steal YT settings icon

    const settingsSVG =
    `<svg id="settingsSVGButton" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="display: block; width: 100%; height: 100%; fill: white;">
        ${ytmSettingsSvg}
    </svg>`;

    // let cogHolder = document.getElementsByTagName('ytmusic-nav-bar')[0]; // Legacy
    let cogHolder = document.getElementById('right-content');
    if(!cogHolder) cogHolder = document.body;


    injectStyle(cogFrame);
    const cogBigHolder = injectElement('div', 'cogBigHolder', cogHolder);
    const cogRotator = injectElement('div', 'cogRotator', cogBigHolder);
    cogRotator.innerHTML = settingsSVG;

    cogBigHolder.addEventListener('click', () => {
        if(ytmpConfig.isOpen === false) ytmpConfig.open();
        else ytmpConfig.close();
    });

    const navbarLogo = document.getElementsByTagName('ytmusic-logo')[0];
    // If window width is too thin, navbarLogo.logoSrc ends width logo.svg, if it does, move back cog to look good
    const logoObserver = new MutationObserver(changes => {
        changes.forEach(change => {
            if(change.attributeName === 'logo-src') {
                if(navbarLogo.logoSrc.endsWith('logo.svg')) cogRotator.style.left = '50px';
                else cogRotator.style.left = '100px';
            }
        });
    });
    logoObserver.observe(navbarLogo, { attributes: true });
}