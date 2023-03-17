import { globals } from '../globals';
import { addFancy, afkEnable, clockEnable, extraButtons, promoEnable, skipDisliked } from '../utils';
import { getVideo } from '../visualizer/init';
import { GM_config } from '../GM/GM_config';

export function keydownEvent(ev) {
    if(ev.code == 'Backslash' && ev.ctrlKey == true) {
        if(globals.settingsOpen === false) {
            GM_config.open();
            globals.settingsOpen = true;
        }
        else {
            GM_config.close();
            globals.settingsOpen = false;
        }
    }
}

export function loadEvent() {
    // Creating bg movement animation by injecting css into head
    // This apparently can be done in a more fancy way
    const animation =
    `@keyframes backgroundGradient {
	    0% {
            background-position: 0% 50%;
        }

        100% {
            background-position: 100% 50%;
        }
    }
    @keyframes clockGradient {
        from {
            background-position: 0% center;
        }
        to {
            background-position: 200% center;
        }
    }`;
    let node = document.createElement('style');
    const textNode = document.createTextNode(animation);
    node.appendChild(textNode);
    document.head.appendChild(node);

    globals.playerPageDiv = document.getElementsByClassName('content style-scope ytmusic-player-page')[0];
    globals.navBarBg = document.getElementById('nav-bar-background');

    // Checking whether functions are turned on, enabling them if yes
    promoEnable(GM_config.get('noPromo'));

    afkEnable(GM_config.get('noAfk')); // Credit to q1k - https://greasyfork.org/en/users/1262-q1k

    if(GM_config.get('bg') == true) {
        // Remove weird bg gradient div stuff that ytm added early december 2022
        document.getElementsByTagName('ytmusic-browse-response')[0].children[0].remove();
        document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';

        addFancy(document.body.style, true);
        addFancy(globals.playerPageDiv.style);
    }

    globals.mainPanel = document.getElementById('main-panel');

    // Tries to removes weird padding
    if(GM_config.get('padding') == true) {
        globals.playerPageDiv.style.paddingTop = '0px';
        globals.mainPanel.style.marginTop = '8vh';
        globals.mainPanel.style.marginBottom = '8vh';
    }
    setTimeout(() => {
        globals.upgradeButton = document.getElementsByClassName('tab-title style-scope ytmusic-pivot-bar-item-renderer')[3];
        globals.originalUpgradeText = globals.upgradeButton.textContent;
        clockEnable(GM_config.get('clock'));
    }, 500);


    // Injecting visualizer canvases
    globals.navBarBg.innerHTML = '<canvas id="visualizerNavbarCanvas" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none"></canvas>';
    globals.navBarBg.style.opacity = 1;
    globals.mainPanel.innerHTML += '<canvas id="visualizerAlbumCoverCanvas" style="position: absolute; z-index: 9999; pointer-events: none; visibility: visible"></canvas>';
    if(GM_config.get('visualizerPlace') != 'Disabled') getVideo();

    skipDisliked(GM_config.get('skipDisliked'));

    extraButtons(GM_config.get('extraButtons'));

    // Adds a settings button on the navbar
    node = document.createElement('iframe');
    node.id = 'ytmPSettings';
    node.src = 'about:blank';
    node.style = 'top: 7px; left: 100px; height: 50px; opacity: 1; overflow: auto; padding: 0px; position: fixed; width: 50px; z-index: 9999; overflow: hidden;';
    document.body.appendChild(node);
    setTimeout(function() {
        const frameDoc = document.getElementById('ytmPSettings').contentWindow.document;
        frameDoc.body.innerHTML = '<svg id="openSettings" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="display: block; width: 100%; height: 100%; fill: white;"><g class="style-scope yt-icon"><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11 l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11 l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51L13.22,21h-2.44l-0.55-2.2l-0.13-0.51 l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59l0.37-0.36l-0.08-0.51 C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62l0.5,0.14l0.4-0.32 C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14L4.34,5.27l-2,3.46 l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83c0.6,0.48,1.27,0.87,2,1.14L10,22h4 l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13 l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z" class="style-scope yt-icon"></path></g></svg>';
        frameDoc.getElementById('openSettings').addEventListener('click', () => {
            if(globals.settingsOpen == false) {
                GM_config.open();
                globals.settingsOpen = true;
            }
            else {
                GM_config.close();
                globals.settingsOpen = false;
            }
        });
    }, 500);
}