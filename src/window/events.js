import { globals } from '../globals';
import { afkEnable, changeBackground, clockEnable, extraButtons, fixLayout, injectStyle, promoEnable, removeThumbnail, skipDisliked } from '../utils';
import { getVideo } from '../visualizer/init';
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

export function loadEvent() {
    globals.playerPageDiv = document.getElementsByClassName('content style-scope ytmusic-player-page')[0];
    globals.navBarBg = document.getElementById('nav-bar-background');
    globals.mainPanel = document.getElementById('main-panel');

    createGradientEffects();

    // Checking whether functions are turned on, enabling them if yes
    promoEnable(GM_config.get('noPromo'));

    afkEnable(GM_config.get('noAfk'));

    changeBackground(GM_config.get('bg'), true);

    skipDisliked(GM_config.get('skipDisliked'));

    extraButtons(GM_config.get('extraButtons'));

    fixLayout(GM_config.get('padding'));

    setTimeout(() => {
        globals.upgradeButton = document.getElementsByClassName('tab-title style-scope ytmusic-pivot-bar-item-renderer')[3];
        globals.originalUpgradeText = globals.upgradeButton.textContent;
        clockEnable(GM_config.get('clock'));

        globals.player = document.getElementById('player');
        removeThumbnail(GM_config.get('removeThumbnail'));
    }, 500);


    // Injecting visualizer canvases
    globals.navBarBg.innerHTML = '<canvas id="visualizerNavbarCanvas" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none"></canvas>';
    globals.navBarBg.style.opacity = 1;
    globals.mainPanel.innerHTML += '<canvas id="visualizerAlbumCoverCanvas" style="position: absolute; z-index: 9999; pointer-events: none; visibility: visible"></canvas>';
    if(GM_config.get('visualizerPlace') !== 'Disabled') getVideo();

    // Adds a settings button on the navbar
    createSettingsFrame();
}

function createGradientEffects() {
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
    injectStyle(animation);
}

function createSettingsFrame() {
    const ytmSettingsSvg = document.getElementById('settings').outerHTML;

    const settingsSVG =
    `<svg id="openSettings" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="display: block; width: 100%; height: 100%; fill: white;">
        ${ytmSettingsSvg}
    </svg>`;

    const node = document.createElement('iframe');
    node.id = 'ytmPSettings';
    node.src = 'about:blank';
    node.style = 'top: 7px; left: 100px; height: 50px; opacity: 1; overflow: auto; padding: 0px; position: fixed; width: 50px; overflow: hidden;';
    try {
        document.getElementsByTagName('ytmusic-nav-bar')[0].appendChild(node);
    }
    catch {
        document.body.appendChild(node);
    }
    setTimeout(function() {
        const frameDoc = document.getElementById('ytmPSettings').contentWindow.document;
        frameDoc.body.innerHTML = settingsSVG;
        frameDoc.getElementById('openSettings').addEventListener('click', () => {
            if(globals.settingsOpen === false) {
                GM_config.open();
                globals.settingsOpen = true;
            }
            else {
                GM_config.close();
                globals.settingsOpen = false;
            }
        });
    }, 500);

    const navbarLogo = document.getElementsByTagName('ytmusic-logo')[0];

    const logoObserver = new MutationObserver(changes => {
        changes.forEach(change => {
            if(change.attributeName === 'logo-src') {
                if(navbarLogo.logoSrc.endsWith('logo.svg')) node.style.left = '50px';
                else node.style.left = '100px';
            }
        });
    });
    logoObserver.observe(navbarLogo, { attributes: true });
}