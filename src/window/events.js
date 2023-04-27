import { globals } from '../globals';
import { afkEnable, changeBackground, clockEnable, extraButtons, fixLayout, injectElement, injectStyle, promoEnable, removeThumbnail, skipDisliked, swapMainPanelWithPlaylist } from '../utils';
import { setupVisualizer } from '../visualizer/init';
import { GM_config } from '../GM/GM_config';

export function keydownEvent(ev) {
    if(ev.code !== 'Backslash' || ev.ctrlKey === false) return;
    if(globals.settingsOpen === false) {
        GM_config.open();
        globals.settingsOpen = true;
    }
    else {
        GM_config.close();
        globals.settingsOpen = false;
    }
}

export async function loadEvent() {
    globals.player = await document.getElementById('player');
    globals.playerPage = await document.getElementById('player-page');
    globals.playerPageDiv = globals.playerPage.firstElementChild;
    globals.navBarBg = await document.getElementById('nav-bar-background');
    globals.mainPanel = await document.getElementById('main-panel');

    injectStyle(animation);

    // Checking whether functions are turned on, enabling them if yes
    promoEnable(GM_config.get('noPromo'));

    afkEnable(GM_config.get('noAfk'));

    changeBackground(GM_config.get('bg'), true);

    skipDisliked(GM_config.get('skipDisliked'));

    extraButtons(GM_config.get('extraButtons'));

    fixLayout(GM_config.get('padding'));

    setTimeout(async () => {
        globals.upgradeButton = await document.getElementsByClassName('tab-title style-scope ytmusic-pivot-bar-item-renderer')[3];
        globals.originalUpgradeText = globals.upgradeButton.textContent;
        clockEnable(GM_config.get('clock'));

        removeThumbnail(GM_config.get('removeThumbnail'));

        swapMainPanelWithPlaylist(GM_config.get('swapMainPanelWithPlaylist'));
    }, 500);

    setupVisualizer();

    // Adds a settings button on the navbar
    createSettingsFrame();
}

const animation =
`@keyframes backgroundGradientHorizontal {
    0% {
        background-position: 0% center;
    }

    100% {
        background-position: 100% center;
    }
}
@keyframes backgroundGradientVertical {
    0% {
        background-position: center 0%;
    }

    100% {
        background-position: center 100%;
    }
}
@keyframes clockGradientHorizontal {
    from {
        background-position: 0% center;
    }
    to {
        background-position: 200% center;
    }
}
@keyframes clockGradientVertical {
    from {
        background-position: center 0%;
    }
    to {
        background-position: center 200%;
    }
}`;

async function createSettingsFrame() {
    const ytmSettingsSvg = document.getElementById('settings').outerHTML; // Steal YT settings icon

    const settingsSVG =
    `<svg id="settingsSVGButton" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="display: block; width: 100%; height: 100%; fill: white;">
        ${ytmSettingsSvg}
    </svg>`;

    let cogHolder = document.getElementsByTagName('ytmusic-nav-bar')[0];
    if(!cogHolder) cogHolder = document.body;

    injectStyle(
        `#cogRotator {
            position: absolute;
            width: 36px;
            height: 36px;
            left: 100px;
            opacity: 1;
            transform: rotate(0);
            filter: drop-shadow(0px 0px 0px #ff00ff);
            transition: 0.15s ease-in-out;
        }
        #cogRotator:hover {
            transform: rotate(90deg);
            filter: drop-shadow(0px 0px 8px #ff00ff);
        }`
    );
    const cogRotator = injectElement('div', 'cogRotator', cogHolder, document);
    cogRotator.innerHTML = settingsSVG;

    const settingsSVGButton = document.getElementById('settingsSVGButton');

    settingsSVGButton.addEventListener('click', () => {
        if(globals.settingsOpen === false) {
            GM_config.open();
            globals.settingsOpen = true;
        }
        else {
            GM_config.close();
            globals.settingsOpen = false;
        }
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