// ==UserScript==
// @name         ytmPlus
// @version      2.5.1
// @author       Mario_D#7052
// @license      MIT
// @namespace    http://tampermonkey.net/
// @updateURL    https://github.com/RealMarioD/ytmplus/raw/main/dist/ytmplus.user.js
// @downloadURL  https://github.com/RealMarioD/ytmplus/raw/main/dist/ytmplus.user.js
// @description  ytmPlus is a userscript that adds multiple visual customizations to YouTube Music.
// @match        https://music.youtube.com/*
// @icon         https://imgur.com/gfg6VLJ.png
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
const vNumber = 'v2.5.1';
try {
    (function() {
        'use strict';

        const configCSS =
`input[type="color"] {
    -webkit-appearance: none;
    border: none;
    padding: 0;
}
input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}
input[type="color"]::-webkit-color-swatch {
    border: 0;
}
input[type="color"], input[type="checkbox"] {
    width: 3vh;
    height: 3vh;
    margin: 0;
    padding: 0;
}
input[type="text"] {
    width: 10.5vh;
}
input {
    background-color: rgba(66, 66, 66, 0.8);
    font-size: 2.5vh;
    border: none;
    border-radius: 1vh;
    padding: 1vh;
}
textarea {
    background-color: rgba(66, 66, 66, 0.8);
    width: 50%;
    height: 5vh;
    resize: none;
    white-space: nowrap;
    overflow-wrap: normal;
    font-size: 2.5vh;
    border: none;
    border-radius: 1vh;
    padding: 1vh;
    scrollbar-width: none;
}
textarea::-webkit-scrollbar {
    display: none;
}
#ytmPlusCfg .config_var {
    margin: 0 0 1%;
    text-align: left;
    height: 6vh;
    display: flex;
    flex-wrap: no-wrap;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1px #6666
}
#ytmPlusCfg * {
    font-family: monospace;
    color: rgba(255, 255, 255, 0.8);
}
#ytmPlusCfg {
    background-color: rgba(0, 0, 0, 0.95);
}
#ytmPlusCfg #ytmPlusCfg_header {
    background: -webkit-linear-gradient(-45deg, rgb(170, 25, 25), rgb(25, 25, 170));
    display: flex;
    flex-direction: column;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: auto 0;
    width: -webkit-fill-available;
    height: 12vh;
}
#ytmPlusCfg .section_header_holder {
    margin-top: 0;
    display: none;
}
#ytmPlusCfg .section_header {
    margin-bottom: 0.5vh;
    font-size: 4.5vh;
}
#ytmPlusCfg .field_label {
    font-size: 3vh;
    display: flex;
    align-items: center;
}
#ytmPlusCfg select {
    background-color: rgba(66, 66, 66, 0.8);
    font-size: 2.5vh;
    border: none;
    border-radius: 1vh;
    padding: 1vh
}
#ytmPlusCfg_wrapper {
    display: flex;
    height: 100%;
    /* height: -webkit-fill-available; */
}
::-webkit-scrollbar {
    width: 1vh;
    height: 0.5vh;
}
::-webkit-scrollbar-track {
    background: #eeea;
    border-radius: 2vh;
}
::-webkit-scrollbar-thumb {
    background: #888a;
    border-radius: 2vh;
}
::-webkit-scrollbar-thumb:hover {
    background: #555f;
}
#ytmPlusCfg_buttons_holder {
    text-align: center;
}
#ytmPlusCfg #ytmPlusCfg_saveBtn {
    margin-right: 2%;
}
#ytmPlusCfg .saveclose_buttons {
    font-size: 2.5vh;
    margin: 0;
    width: 49%;
    padding: 1.5vh;
    border: solid 3px transparent;
    border-radius: 1vh;
    background: rgba(66, 66, 66, 0.8);
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(45deg, var(--borderColor2), var(--borderColor1), var(--borderColor2));
    background-size: 200% 100%;
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 2px 1000px 1px #333 inset;
    animation: buttonBorder 2s infinite forwards linear;
}
#ytmPlusCfg .saveclose_buttons:disabled {
    --borderColor1: #dd0055ee;
    --borderColor2: #5500ddee;
    animation: buttonBorder 2s infinite forwards linear;
}
#ytmPlusCfg .saveclose_buttons:hover {
    --borderColor1: #ff0077ff;
    --borderColor2: #7700ffff;
    animation: buttonBorder 1s infinite forwards linear;
}
#ytmPlusCfg .saveclose_buttons:active {
    --borderColor1: #6600eecc;
    --borderColor2: #ee0066cc;
    animation: buttonBorder 0.5s infinite forwards linear;
}
#ytmPlusCfg .reset_holder {
    margin: 4vh 0 auto;
    text-align: center;
}
#ytmPlusCfg .reset {
    font-size: 2vh;
    color: rgba(255, 255, 255, 0.8);
}
svg {
    width: inherit;
    height: inherit;
    margin: auto;
}
svg text {
    font-size: 9vh;
    animation: stroke 10s infinite alternate linear;
    stroke-width: 2;
    stroke: #aa0000;
}
@keyframes stroke {
    0%   {
        fill: rgba(200,0,85,0.25); stroke: rgba(170,0,85,1);
        stroke-dashoffset: 25%; stroke-dasharray: 10%; stroke-width: 3;
    }
    100% {
        fill: rgba(200,0,85,0.25); stroke: rgba(170,0,85,1);
        stroke-dashoffset: -25%; stroke-dasharray: 10%;
    }
}
#cfgHolder {
    display: flex;
    height: 100%;
}
#categorySelect {
    min-width: 30vw;
    width: 30vw;
    max-width: 30vw;
    justify-content: flex-start;
    border-right: solid #6666;
    display: flex;
    flex-direction: column;
    padding: 0 4vh;
}
:root {
    --borderColor1: #66003366;
    --borderColor2: #33006666;
}
@keyframes buttonBorder {
    0% {
        background-position: 0% center;
    }
    100% {
        background-position: 200% center;
    }
}
.changeCategoryButton {
    border: solid 3px transparent;
    border-radius: 1vh;
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(45deg, var(--borderColor2), var(--borderColor1), var(--borderColor2));
    background-size: 200% 100%;
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 2px 1000px 1px #333 inset;
    padding: 1.5vh;
    margin-bottom: 2vh;
    height: auto;
    white-space: pre-wrap;
    animation: buttonBorder 2s infinite forwards linear;
}
.changeCategoryButton:disabled {
    --borderColor1: #dd0055ee;
    --borderColor2: #5500ddee;
    animation: buttonBorder 2s infinite forwards linear;
}
.changeCategoryButton:hover {
    --borderColor1: #ff0077ff;
    --borderColor2: #7700ffff;
    animation: buttonBorder 1s infinite forwards linear;
}
.changeCategoryButton:active {
    --borderColor1: #6600eecc;
    --borderColor2: #ee0066cc;
    animation: buttonBorder 0.5s infinite forwards linear;
}
#currentSettings {
    width: -moz-available;
    width: -webkit-fill-available;
    overflow: overlay;
    justify-content: center;
    display: flex;
    flex-direction: column;
    padding: 0 4vh;
}
@-moz-document url-prefix() {
    #currentSettings {
        overflow: scroll;
    }
}`;

        const fieldTexts = {
            lang: { english: '<span title="Refresh for changes">Language↻</span>', hungarian: '<span title="Frissíts a változásokhoz">Nyelv↻</span>' },
            langSection: { english: 'Utilities', hungarian: 'Hasznosságok' },
            noAfk: { english: 'Never AFK', hungarian: 'Sosem AFK' },
            noPromo: { english: 'No Promotions', hungarian: 'Promóciók kikapcsolása' },
            skipDisliked: { english: 'Skip Disliked Songs', hungarian: 'Nem kedvelt dalok kihagyása' },
            padding: { english: 'Fix Layout', hungarian: 'Elrendezés javítása' },
            extraButtons: { english: 'Extra Playback Buttons', hungarian: 'Több Irányító Gomb' },
            removeThumbnail: { english: 'Remove Album Cover', hungarian: 'Album Borító Eltávolítása' },
            swapMainPanelWithPlaylist: { english: 'Swap Album Cover with Playlist', hungarian: 'Album Borító és Lejátszási Lista felcserélése' },
            bg: { english: 'Change Background', hungarian: 'Háttér megváltoztatása' },
            bgSection: { english: 'Background Settings', hungarian: 'Háttér beállítások' },
            bgColor: { english: 'Background Color', hungarian: 'Háttérszín' },
            bgEnableGradient: { english: 'Enable Gradient', hungarian: 'Háttér színátmenet engedélyezése' },
            bgGradient: { english: 'Background Gradient Color', hungarian: 'Háttér színátmenet' },
            bgGradientAngle: { english: 'Gradient Angle', hungarian: 'Színátmenet Irány' },
            bgGradientAnimation: { english: 'Gradient Animation', hungarian: 'Színátmenet Animáció' },
            clock: { english: 'Change "Upgrade" Button', hungarian: '"Bővítés" Gomb Cserélése' },
            clockSection: { english: 'Upgrade Button', hungarian: 'Bővítés Gomb' },
            clockColor: { english: 'Clock Color', hungarian: 'Óra Színe' },
            clockGradient: { english: 'Enable Gradient', hungarian: 'Színátmenet Engedélyezése' },
            clockGradientColor: { english: 'Gradient Color', hungarian: 'Színátmenet' },
            clockGradientAngle: { english: 'Gradient Angle', hungarian: 'Színátmenet Irány' },
            clockGradientAnimation: { english: 'Gradient Animation', hungarian: 'Színtámenet Animáció' },
            visualizerPlace: { english: 'Visualizer Place', hungarian: 'Vizualizáló Helye' },
            visualizerPlaceSection: { english: 'Music Visualizer', hungarian: 'Zene Vizualizáló' },
            visualizerStartsFrom: { english: 'Visualizer Starts from', hungarian: 'Vizualizáló innen kezdődik:' },
            // visualizerStartsFromOptions: { english: ['Left', 'Center', 'Right', 'Edges'], hungarian: ['Bal', 'Közép', 'Jobb', 'Szélek'] },
            visualizerColor: { english: 'Visualizer Color', hungarian: 'Vizualizáló Színe' },
            visualizerRgbEnabled: { english: 'RGB Mode', hungarian: 'RGB Mód' },
            visualizerFade: { english: 'Enable Bar Fade', hungarian: 'Sávok Áttűnésének Engedélyezése' },
            visualizerFft: { english: '<span title="High values can affect performance and can break circle visualizer.">Bar Amount⚠</span>', hungarian: '<span title="Magas értékek befolyásolhatják a teljesítményt és hibát okozhatnak a kör vizualizálóban.">Sáv mennyiség⚠</span>' },
            visualizerEnergySaverType: { english: 'Energy Saver', hungarian: 'Energiatakarékos mód' },
            visualizerCircleEnabled: { english: 'Enable (Album Cover Only)', hungarian: 'Engedélyez (Csak Album Borítón)' },
            visualizerCircleEnabledSection: { english: 'Circle Visualizer', hungarian: 'Kör Vizualizáló' },
            visualizerRotate: { english: 'Rotation', hungarian: 'Forgás' },
            visualizerRotateDirection: { english: 'Rotation Direction', hungarian: 'Forgásirány' },
            visualizerMove: { english: 'Bars Movement Direction', hungarian: 'Sávok Mozgásiránya' },
            visualizerBassBounceEnabled: { english: 'Bass Bounce', hungarian: 'Basszusugrálás' },
            visualizerBassBounceSmooth: { english: 'Smooth Bounce', hungarian: 'Ugrálás Simítása' },
            visualizerImageType: { english: 'Visualizer Image', hungarian: 'Vizualizáló Kép' },
            visualizerImageCustomURL: { english: 'Custom Image URL', hungarian: 'Egyéni Kép URL' },
            attention1: { english: 'Changes here can cause glitches!', hungarian: 'Az itteni változtatások hibákat okozhatnak!' },
            attention1Section: { english: 'Advanced Visualizer Settings', hungarian: 'Speciális Vizualizáló Beállítások' },
            visualizerRgbRed: { english: 'RGB:Red', hungarian: 'RGB:Piros' },
            visualizerRgbGreen: { english: 'RGB:Green', hungarian: 'RGB:Zöld' },
            visualizerRgbBlue: { english: 'RGB:Blue', hungarian: 'RGB:Kék' },
            visualizerRgbSamples: { english: 'RGB:Samples', hungarian: 'RGB:Minták' },
            visualizerMinDecibels: { english: 'Min Decibels', hungarian: 'Min Decibel' },
            visualizerMaxDecibels: { english: 'Max Decibels', hungarian: 'Max Decibel' },
            visualizerSmoothing: { english: 'Smoothening', hungarian: 'Simítás' },
            visualizerKeepHertz: { english: 'AudioData Max Hertz', hungarian: 'AudioData Max Hertz' },
            visualizerBassBounceMinHertz: { english: 'Bass Bounce Min Hertz', hungarian: 'Basszusugrálás Min Hertz' },
            visualizerBassBounceMaxHertz: { english: 'Bass Bounce Max Hertz', hungarian: 'Basszusugrálás Max Hertz' },
            visualizerBassBounceDebug: { english: 'Bass Bounce Debug Color', hungarian: 'Basszusugrálás Debug Szín' },
            visualizerEnergySaverFps: { english: 'Energy Saver FPS', hungarian: 'Energiatakarékos FPS' }
        };

        let langOption = GM_getValue('ytmPlusCfg', 'english');
        if(langOption != 'english') {
            langOption = JSON.parse(langOption).lang;
            if(!langOption) langOption = 'english';
            else langOption = langOption.charAt(0).toLowerCase() + langOption.slice(1);
        }

        // 'type': 'color'; just results in a text input, they are later converted to actual color input, see open event
        const configFields = {
            lang: {
                label: fieldTexts.lang[langOption],
                section: fieldTexts.langSection[langOption],
                type: 'select',
                options: ['English', 'Hungarian'],
                default: 'English'
            },
            noAfk: {
                label: fieldTexts.noAfk[langOption],
                type: 'checkbox',
                default: true
            },
            noPromo: {
                label: fieldTexts.noPromo[langOption],
                type: 'checkbox',
                default: true
            },
            skipDisliked: {
                label: fieldTexts.skipDisliked[langOption],
                type: 'checkbox',
                default: false
            },
            padding: {
                label: fieldTexts.padding[langOption],
                type: 'checkbox',
                default: true
            },
            extraButtons: {
                label: fieldTexts.extraButtons[langOption],
                type: 'checkbox',
                default: true
            },
            removeThumbnail: {
                label: fieldTexts.removeThumbnail[langOption],
                type: 'checkbox',
                default: false
            },
            swapMainPanelWithPlaylist: {
                label: fieldTexts.swapMainPanelWithPlaylist[langOption],
                type: 'checkbox',
                default: false
            },
            bg: {
                label: fieldTexts.bg[langOption],
                section: fieldTexts.bgSection[langOption],
                type: 'checkbox',
                default: true
            },
            bgColor: {
                label: fieldTexts.bgColor[langOption],
                type: 'color',
                default: '#AA0000'
            },
            bgEnableGradient: {
                label: fieldTexts.bgEnableGradient[langOption],
                type: 'checkbox',
                default: true
            },
            bgGradient: {
                label: fieldTexts.bgGradient[langOption],
                type: 'color',
                default: '#0000AA'
            },
            bgGradientAngle: {
                label: fieldTexts.bgGradientAngle[langOption],
                type: 'int',
                min: -360,
                max: 360,
                default: 45
            },
            bgGradientAnimation: {
                label: fieldTexts.bgGradientAnimation[langOption],
                type: 'select',
                options: ['Disabled', 'Horizontal', 'Vertical'],
                default: 'Horizontal'
            },
            clock: {
                label: fieldTexts.clock[langOption],
                section: fieldTexts.clockSection[langOption],
                type: 'select',
                options: ['Original', 'Remove Button', 'Digital Clock'],
                default: 'Digital Clock'
            },
            clockColor: {
                label: fieldTexts.clockColor[langOption],
                type: 'color',
                default: '#AA3333'
            },
            clockGradient: {
                label: fieldTexts.clockGradient[langOption],
                type: 'checkbox',
                default: true
            },
            clockGradientColor: {
                label: fieldTexts.clockGradientColor[langOption],
                type: 'color',
                default: '#3333AA'
            },
            clockGradientAngle: {
                label: fieldTexts.clockGradientAngle[langOption],
                type: 'int',
                min: -360,
                max: 360,
                default: 90
            },
            clockGradientAnimation: {
                label: fieldTexts.clockGradientAnimation[langOption],
                type: 'select',
                options: ['Disabled', 'Horizontal', 'Vertical'],
                default: 'Horizontal'
            },
            visualizerPlace: {
                label: fieldTexts.visualizerPlace[langOption],
                section: fieldTexts.visualizerPlaceSection[langOption],
                type: 'select',
                options: ['Disabled', 'Navbar', 'Album Cover', 'Background'],
                default: 'Album Cover'
            },
            visualizerStartsFrom: {
                label: fieldTexts.visualizerStartsFrom[langOption],
                type: 'select',
                options: ['Left', 'Center', 'Right', 'Edges'],
                default: 'Center'
            },
            visualizerColor: {
                label: fieldTexts.visualizerColor[langOption],
                type: 'color',
                default: '#C800C8'
            },
            visualizerRgbEnabled: {
                label: fieldTexts.visualizerRgbEnabled[langOption],
                type: 'checkbox',
                default: true
            },
            visualizerFade: {
                label: fieldTexts.visualizerFade[langOption],
                type: 'checkbox',
                default: false
            },
            visualizerFft: {
                label: fieldTexts.visualizerFft[langOption],
                type: 'select',
                options: ['32', '64', '128', '256', '512', '1024', '2048', '4096', '8192', '16384'],
                default: '1024',
            },
            visualizerEnergySaverType: {
                label: fieldTexts.visualizerEnergySaverType[langOption],
                type: 'select',
                options: ['Disabled', 'Limit FPS', 'True Pause', 'Both'],
                default: 'Disabled'
            },
            visualizerCircleEnabled: {
                label: fieldTexts.visualizerCircleEnabled[langOption],
                section: fieldTexts.visualizerCircleEnabledSection[langOption],
                type: 'checkbox',
                default: true
            },
            visualizerRotate: {
                label: fieldTexts.visualizerRotate[langOption],
                type: 'select',
                options: ['Disabled', 'On', 'Reactive', 'Reactive (Bass)'],
                default: 'Disabled'
            },
            visualizerRotateDirection: {
                label: fieldTexts.visualizerRotateDirection[langOption],
                type: 'select',
                options: ['Clockwise', 'Counter-Clockwise'],
                default: 'Clockwise'
            },
            visualizerMove: {
                label: fieldTexts.visualizerMove[langOption],
                type: 'select',
                options: ['Inside', 'Outside', 'Both Sides'],
                default: 'Outside'
            },
            visualizerBassBounceEnabled: {
                label: fieldTexts.visualizerBassBounceEnabled[langOption],
                type: 'checkbox',
                default: true
            },
            visualizerBassBounceSmooth: {
                label: fieldTexts.visualizerBassBounceSmooth[langOption],
                type: 'checkbox',
                default: true
            },
            visualizerImageType: {
                label: fieldTexts.visualizerImageType[langOption],
                type: 'select',
                options: ['Disabled', 'Thumbnail', 'Custom'],
                default: 'Thumbnail'
            },
            visualizerImageCustomURL: {
                label: fieldTexts.visualizerImageCustomURL[langOption],
                type: 'textarea',
                default: 'https://yt3.googleusercontent.com/ytc/AL5GRJX3OEex8FqN1gogsXQZNB7fV9TVHfda2EynDiW9_g=s900-c-k-c0x00ffffff-no-rj'
            },
            attention1: {
                label: fieldTexts.attention1[langOption],
                section: fieldTexts.attention1Section[langOption],
                type: 'hidden'
            },
            visualizerRgbRed: {
                label: fieldTexts.visualizerRgbRed[langOption],
                type: 'int',
                min: 0,
                max: 255,
                default: 255
            },
            visualizerRgbGreen: {
                label: fieldTexts.visualizerRgbGreen[langOption],
                type: 'int',
                min: 0,
                max: 255,
                default: 255
            },
            visualizerRgbBlue: {
                label: fieldTexts.visualizerRgbBlue[langOption],
                type: 'int',
                min: 0,
                max: 255,
                default: 255
            },
            visualizerRgbSamples: {
                label: fieldTexts.visualizerRgbSamples[langOption],
                type: 'int',
                min: 1,
                max: 8192,
                default: 512
            },
            visualizerMinDecibels: {
                label: fieldTexts.visualizerMinDecibels[langOption],
                type: 'int',
                min: -100,
                max: 0,
                default: -85
            },
            visualizerMaxDecibels: {
                label: fieldTexts.visualizerMaxDecibels[langOption],
                type: 'int',
                min: -100,
                max: 0,
                default: 0
            },
            visualizerSmoothing: {
                label: fieldTexts.visualizerSmoothing[langOption],
                type: 'float',
                min: 0,
                max: 1,
                default: 0.3
            },
            visualizerKeepHertz: {
                label: fieldTexts.visualizerKeepHertz[langOption],
                type: 'int',
                min: 1,
                max: 44100,
                default: 18450
            },
            visualizerBassBounceMinHertz: {
                label: fieldTexts.visualizerBassBounceMinHertz[langOption],
                type: 'float',
                min: 0,
                max: 44100,
                default: 0
            },
            visualizerBassBounceMaxHertz: {
                label: fieldTexts.visualizerBassBounceMaxHertz[langOption],
                type: 'float',
                min: 1,
                max: 44100,
                default: 100
            },
            visualizerBassBounceDebug: {
                label: fieldTexts.visualizerBassBounceDebug[langOption],
                type: 'checkbox',
                default: false
            },
            visualizerEnergySaverFps: {
                label: fieldTexts.visualizerEnergySaverFps[langOption],
                type: 'int',
                min: 1,
                max: 144,
                default: 30,
            }
        };

        function logplus(...logs) {
            switch(logs[0]) {
                case 'error': {
                    logs.shift();
                    for(const data of logs) console.error('ytmPlus: ' + data);
                    break;
                }
                case 'warn': {
                    logs.shift();
                    for(const data of logs) console.warn('ytmPlus: ' + data);
                    break;
                }
                case 'green': {
                    logs.shift();
                    for(const data of logs) console.log('%cytmPlus: ' + data, 'background: #006600'); break;
                }
                default: for(const data of logs) console.log('ytmPlus: ' + data); break;
            }
        }

        function promoEnable(turnOn) {
            let popup;
            clearInterval(globals.noPromoFunction);
            if(!turnOn) return;
            globals.noPromoFunction = setInterval(() => {
                popup = document.getElementsByTagName('ytmusic-mealbar-promo-renderer');
                if(popup.length > 0) {
                    popup[0].remove();
                    logplus('Removed a promotion.');
                }
            }, 1000);
        }

        function afkEnable(turnOn) { // Credit to q1k - https://greasyfork.org/en/users/1262-q1k
            clearInterval(globals.noAfkFunction);
            if(!turnOn) return;
            globals.noAfkFunction = setInterval(() => {
                document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 }));
                logplus('Nudged the page so user is not AFK.');
            }, 15000);
        }

        function clockEnable(mode) {
            let currentTime;
            clearInterval(globals.clockFunction);
            if(mode === 'Original') {
                globals.upgradeButton.textContent = globals.originalUpgradeText;
                globals.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
            }
            else if(mode === 'Digital Clock') {
                globals.clockFunction = setInterval(() => {
                    currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    globals.upgradeButton.textContent = currentTime;
                }, 1000);
                globals.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
            }
            else {
                globals.upgradeButton.textContent = '';
                globals.upgradeButton.parentElement.style.margin = '0px';
            }

            // Trust me this is the way
            const buttonStyle = globals.upgradeButton.style;
            if(mode === 'Digital Clock') {
                buttonStyle.background = `linear-gradient(${GM_config.get('clockGradientAngle')}deg, ${GM_config.get('clockColor')} 0%, ${GM_config.get('clockGradient') === true ? GM_config.get('clockGradientColor') : GM_config.get('clockColor')} 50%, ${GM_config.get('clockColor')} 100%)`;
                buttonStyle.backgroundSize = '200% 200%';
                buttonStyle.backgroundClip = 'text';
                buttonStyle.textFillColor = 'transparent';
                buttonStyle.webkitBackgroundClip = 'text';
                buttonStyle.webkitTextFillColor = 'transparent';
                buttonStyle.fontSize = '50px';
                const animation = GM_config.get('clockGradientAnimation');
                if(animation === 'Horizontal') buttonStyle.animation = 'clockGradientHorizontal 2s linear infinite normal';
                else if(animation === 'Vertical') buttonStyle.animation = 'clockGradientVertical 2s linear infinite normal';
                else buttonStyle.animation = '';
            }
            else {
                buttonStyle.background = '';
                buttonStyle.backgroundSize = '';
                buttonStyle.backgroundClip = '';
                buttonStyle.textFillColor = '';
                buttonStyle.webkitBackgroundClip = '';
                buttonStyle.webkitTextFillColor = '';
                buttonStyle.fontSize = '20px';
            }
        }

        function changeBackground(option, firstRun) {
            if(option === false) {
                if(document.body.style.backgroundImage !== '') {
                    document.body.style.backgroundColor = '#000000';
                    document.body.style.backgroundImage = '';
                    globals.playerPageDiv.style.backgroundColor = '#000000';
                    globals.playerPageDiv.style.backgroundImage = '';
                }
                return;
            }
            try {
                if(firstRun === true) document.getElementsByTagName('ytmusic-browse-response')[0].children[0].remove();
                document.getElementsByClassName('immersive-background style-scope ytmusic-browse-response')[0].children[0].remove();
            }
            catch { }
            document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';
            const animation = GM_config.get('bgGradientAnimation');
            addFancy(document.body.style, true, animation);
            addFancy(globals.playerPageDiv.style, false, animation);
        }

        function addFancy(e, overflowOn, animation) {
            e.backgroundImage = `linear-gradient(${GM_config.get('bgGradientAngle')}deg, ${GM_config.get('bgColor')}, ${GM_config.get('bgEnableGradient') == true ? GM_config.get('bgGradient') : GM_config.get('bgColor')})`;
            if(animation === 'Horizontal') {
                e.backgroundSize = '200% 200%';
                e.animation = 'backgroundGradientHorizontal 5s linear infinite alternate';
            }
            else if(animation === 'Vertical') {
                e.backgroundSize = '200% 200%';
                e.animation = 'backgroundGradientVertical 5s linear infinite alternate';
            }
            else {
                e.backgroundSize = '100% 100%';
                e.animation = '';
                e.backgroundPosition = 'center center';
            }
            e.backgroundAttachment = 'fixed';
            if(overflowOn === false) e.overflow = 'hidden';
        }

        function checkDislike() {
            if(globals.dumbFix === 0) return globals.dumbFix++;
            clearTimeout(globals.skipDislikedFunction);
            globals.skipDislikedFunction = setTimeout(() => {
                if(document.getElementById('like-button-renderer').children[0].ariaPressed == 'true') document.getElementsByClassName('next-button style-scope ytmusic-player-bar')[0].click();
            }, 5000);
            globals.dumbFix = 0;
        }

        function skipDisliked(turnOn) {
            const titleHolder = document.getElementsByClassName('title style-scope ytmusic-player-bar')[0];
            titleHolder.removeEventListener('DOMSubtreeModified', checkDislike, false);
            if(!turnOn) return;
            titleHolder.addEventListener('DOMSubtreeModified', checkDislike, false);
        }

        function extraButtons(turnOn) {
            const playbackButtons = document.getElementsByClassName('left-controls-buttons style-scope ytmusic-player-bar')[0].children;
            const playbackRateButton = document.getElementsByTagName('ytmusic-playback-rate-renderer')[0];
            if(!turnOn) {
                playbackButtons[1].hidden = true;
                playbackButtons[4].hidden = true;
                playbackRateButton.hidden = true;
            }
            else {
                playbackButtons[1].hidden = false;
                playbackButtons[4].hidden = false;
                playbackRateButton.hidden = false;
            }
        }

        function fixLayout(turnOn) {
            if(turnOn) {
                globals.playerPageDiv.style.paddingTop = '0px';
                globals.mainPanel.style.marginTop = '8vh';
                globals.mainPanel.style.marginBottom = '8vh';
            }
            else {
                globals.playerPageDiv.style.padding = 'var(--ytmusic-player-page-vertical-padding) var(--ytmusic-player-page-horizontal-padding) 0';
                globals.mainPanel.style.marginTop = '0';
                globals.mainPanel.style.marginBottom = 'var(--ytmusic-player-page-vertical-padding)';
            }
        }

        function removeThumbnail(turnOn) {
            globals.player.style.backgroundColor = '#00000001'; // minimal visibility required so shit doesn't break, don't ask
            const songImage = document.getElementById('song-image');
            setTimeout(() => {
                if(!turnOn) {
                    songImage.style.opacity = 1;
                    songImage.style.removeProperty('background');
                }
                else {
                    songImage.style.opacity = 0.001;
                    songImage.style.background = '#0000';
                }
            }, 500);
        }

        async function swapMainPanelWithPlaylist(turnOn) {
            if(turnOn) {
                if(globals.mainPanel.parentNode.lastElementChild.id === globals.mainPanel.id) return;
                await globals.mainPanel.parentNode.append(globals.mainPanel);
                globals.mainPanel.style.flexDirection = 'row-reverse';
                globals.mainPanel.parentNode.children[1].style.margin = '0 var(--ytmusic-player-page-content-gap) 0 0';
            }
            else {
                if(globals.mainPanel.parentNode.firstElementChild.id === globals.mainPanel.id) return;
                await globals.mainPanel.parentNode.prepend(globals.mainPanel);
                globals.mainPanel.style.flexDirection = 'row';
                globals.mainPanel.parentNode.lastElementChild.style.margin = '0 0 0 var(--ytmusic-player-page-content-gap)';
            }
        }

        function averageOfArray(numbers) {
            let result = 0;
            for(let i = 0; i < numbers.length; i++) result += numbers[i];
            return result / numbers.length;
        }

        function injectStyle(css) {
            const node = document.createElement('style');
            const textNode = document.createTextNode(css);
            node.appendChild(textNode);
            document.head.appendChild(node);
        }

        function injectElement(type, id, wrapperElm, targetDoc, customStyle, prepend) {
            const node = targetDoc.createElement(type);
            node.id = id;
            if(customStyle) node.style = customStyle;
            if(!wrapperElm) {
                logplus('error', 'injectElement: Wrapper is undefined');
                return;
            }
            if(prepend) wrapperElm.prepend(node);
            else wrapperElm.appendChild(node);
            return node;
        }

        const image = new Image(),
            thumbnailChildSrc = () => {
                try {
                    return document.getElementsByClassName('thumbnail style-scope ytmusic-player no-transition')[0].firstElementChild.src;
                }
                catch {
                    return undefined;
                }
            },
            currentVideoURL = () => document.getElementsByClassName('ytp-title-link yt-uix-sessionlink')[0];
        let imgLoaded = false, lastSavedVideoURL, currentURL, wRatio, hRatio, loadSD, quality;

        image.onload = () => {
            if(quality === 'maxresdefault' && image.height < 100) { // loaded 404 maxresdefault
                imgLoaded = false;
                loadSD = true;
                return replaceImageURL();
            }
            hRatio = image.height / image.width;
            wRatio = image.width / image.height;
            imgLoaded = true;
        };

        image.onerror = () => {
            if(visualizer.image.type === 'Custom') logplus('Custom Image URL is not an image');
            else {
                logplus('warn', 'Visualizer Image couldn\'t be loaded.');
                return;
            }
            visualizer.image.customURL = 'https://imgur.com/Nkj0d6D.png';
            replaceImageURL();
        };

        const observer = new MutationObserver(changes => {
            changes.forEach(change => {
                if(change.attributeName === 'href' && currentVideoURL().href != undefined) replaceImageURL();
            });
        });
        setTimeout(() => observer.observe(currentVideoURL(), { attributes: true }), 1000);

        function thumbnailEvent() {
            currentURL = thumbnailChildSrc();
            if(!currentURL) {
                logplus('thumbnailChildSrc is undefined');
                return;
            }

            if(currentURL.indexOf('data') === 0) {
                logplus('Current song has broken thumbnail, might be a video');

                if(lastSavedVideoURL !== currentVideoURL().href) lastSavedVideoURL = currentVideoURL().href;
                else if(loadSD === false && quality !== 'custom') {
                    logplus('Multiple changes with same URL, loadSD is false, quality is not custom');
                    return;
                }

                if(!lastSavedVideoURL) {
                    logplus('lastSavedVideoURL is empty, currentVideoURL.href is likely undefined');
                    return;
                }

                logplus(`Changed lastSavedVideoURL to: ${lastSavedVideoURL}`);
                imgLoaded = false;
                if(loadSD === true) {
                    quality = 'sddefault';
                    logplus(`loadSD is true, working with ${quality}`);
                }
                else quality = 'maxresdefault';
                currentURL = `https://i.ytimg.com/vi/${lastSavedVideoURL.split('v=')[1]}/${quality}.jpg`;
                loadSD = false;
            }
            else if(image.src === currentURL) {
                logplus('Image src is already thumbnail');
                return;
            }
            lastSavedVideoURL = currentVideoURL().href;
            finalize();
        }

        function customEvent() {
            if(currentURL === visualizer.image.customURL) {
                logplus('Custom Image change: URL is the same');
                return;
            }
            currentURL = visualizer.image.customURL;
            quality = 'custom';
            finalize();
        }

        function finalize() {
            logplus('green', `Changed currentURL to: ${currentURL}`);
            imgLoaded = false;
            image.src = currentURL;
        }

        function replaceImageURL() {
            if(visualizer.image.type === 'Thumbnail') thumbnailEvent();
            else if(visualizer.image.type === 'Custom') customEvent();
        }

        const PI2 = Math.PI * 2;
        function drawVisImage() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(values.halfWidth, values.halfHeight, values.radius, 0, PI2, true);
            ctx.closePath();
            ctx.clip();

            let radiusMultX = values.radius, radiusMultY = 1; // default values for 1:1 aspect ratio

            if(quality === 'sddefault') { // enlarge image to cut off "cinematic bars"
                radiusMultX *= 1.33;
                radiusMultY = wRatio;
            }
            else if(hRatio > 1) { // vertical img handling
                radiusMultX *= hRatio;
                radiusMultY = wRatio;
            }
            else radiusMultY *= wRatio; // horizontal img handling

            ctx.drawImage(
                image,
                values.halfWidth - radiusMultX * radiusMultY,
                values.halfHeight - radiusMultX,
                radiusMultX * 2 * radiusMultY,
                radiusMultX * 2
            );
            ctx.restore();
        }

        function visualizerCircle() { // Bitwise truncation (~~number) is used here instead of Math.floor() to squish out more performance.
            if(visualizer.startsFrom === 'Left' || visualizer.startsFrom === 'Right') values.circleSize = 2; // 2(pi) = full
            else values.circleSize = 1; // 1(pi) = half;

            if(visualizer.bassBounce.enabled === true ||
            visualizer.rotate === 'Reactive (Bass)') calculateBass();

            getRotationValue();

            if(visualizer.image.type !== 'Disabled' && imgLoaded === true) drawVisImage();

            values.reactiveBarHeightMultiplier = 0.3 + values.bassSmoothRadius / 512; // 0.3 . . 0.55

            if(visualizer.startsFrom === 'Right') drawArcs(false);
            else if(visualizer.startsFrom === 'Left') drawArcs(true);
            else if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') {
                drawArcs(false);
                drawArcs(true);
            }
        }

        function calculateBass() {
            values.bass = visualizer.audioData.slice(
                visualizer.bassBounce._barStart,
                visualizer.bassBounce._barEnd
            );

            if(visualizer.bassBounce.smooth === true) values.bassSmoothRadius = ~~((values.bassSmoothRadius + (averageOfArray(values.bass) / 2)) / 2);
            else values.bassSmoothRadius = ~~(averageOfArray(values.bass) / 2);

            if(visualizer.bassBounce.enabled === true) values.radius = ~~(values.HEIGHT / 8) + values.bassSmoothRadius * values.heightModifier * 1.25;
        }

        function getRotationValue() {
            const direction = (visualizer.rotateDirection === 'Clockwise') ? 1 : -1;

            switch(visualizer.rotate) {
                case 'Disabled': default: { values.rotationValue = 0; } break;
                case 'On': { values.rotationValue += 0.005 * direction; } break;
                case 'Reactive': { values.rotationValue += (Math.pow(averageOfArray(visualizer.audioData) / 10000 + 1, 2) - 1) * direction; } break;
                case 'Reactive (Bass)': { values.rotationValue += (Math.pow(values.bassSmoothRadius / 10000 + 1, 2) - 1) * direction; } break;
            }
        }

        function drawArcs(backwards) {
            ctx.save();
            ctx.translate(values.halfWidth, values.halfHeight); // move to center of circle
            if(backwards === true) ctx.rotate(values.startingPoint - (values.barTotal / 2 + values.rotationValue));
            else ctx.rotate(values.startingPoint + (values.barTotal / 2 + values.rotationValue)); // Set bar starting point to top + rotation

            for(let i = 0; i < visualizer.bufferLength; ++i) {
            // if(values.circleSize === 1 && backwards === true && (i === 0 || i === visualizer.bufferLength - 1)) {
            //     ctx.rotate(-values.barTotal);
            //     continue;
            // }

                getBarColor(i);

                if(visualizer.bassBounce.enabled === true) values.barHeight = visualizer.audioData[i] * values.heightModifier * values.reactiveBarHeightMultiplier;
                else values.barHeight = visualizer.audioData[i] * values.heightModifier * 0.5;

                if(visualizer.move === 'Outside' || visualizer.move === 'Both Sides') values.outerRadius = values.radius + values.barHeight;
                else values.outerRadius = values.radius;

                if(visualizer.move === 'Inside' || visualizer.move === 'Both Sides') values.innerRadius = values.radius - values.barHeight;
                else values.innerRadius = values.radius;

                if(values.outerRadius < 0) values.outerRadius = 0;
                if(values.innerRadius < 0) values.innerRadius = 0;

                ctx.beginPath();
                ctx.arc(0, 0, values.innerRadius, -values.barWidth, values.barWidth);
                ctx.arc(0, 0, values.outerRadius, values.barWidth, -values.barWidth, true);
                ctx.fill();
                if(backwards === true) ctx.rotate(-values.barTotal); // rotate the coordinates by one bar
                else ctx.rotate(values.barTotal);
            }
            ctx.restore();
        }

        function visualizerNavbar() {
            if(visualizer.startsFrom === 'Center') values.xPosOffset = values.barWidth + values.barSpace / 2; // Centers 1 bar
            else if(visualizer.startsFrom === 'Edges') values.xPosOffset = values.barSpace / 2; // Both sides are offset a bit for perfect centering
            else values.xPosOffset = 0;

            const maxBarHeight = (values.HEIGHT / 255);

            firstDraw(maxBarHeight);

            if(visualizer.startsFrom === 'Center') {
                values.xPosOffset = values.halfWidth + values.barSpace / 2; // Reset pos to center + skip first bar
                secondDraw(maxBarHeight, 0);
            }
            else if(visualizer.startsFrom === 'Edges') {
                values.xPosOffset = values.barWidth + (values.barSpace / 2); // Reset pos to right + offset for perfect center
                secondDraw(maxBarHeight, 0);
            }
        }

        function firstDraw(maxBarHeight) {
            for(let i = 0; i < visualizer.bufferLength; i++) {
                values.barHeight = visualizer.audioData[i] * maxBarHeight;

                getBarColor(i);

                // To this day I don't get the Y and values.HEIGHT values
                if(visualizer.startsFrom === 'Left') {
                    ctx.fillRect( // Draws rect from left to right
                        values.xPosOffset,
                        values.HEIGHT - values.barHeight,
                        values.barWidth,
                        values.barHeight
                    );
                }
                else if(visualizer.startsFrom === 'Center') {
                    if(values.halfWidth - values.xPosOffset < 0 - values.barWidth) break;
                    ctx.fillRect( // Draws rect from left to right, starting from center to left
                        values.halfWidth - values.xPosOffset,
                        values.HEIGHT - values.barHeight,
                        values.barWidth,
                        values.barHeight
                    );
                }
                else if(visualizer.startsFrom === 'Right') {
                    ctx.fillRect( // Draws rect from right to left
                        values.WIDTH - values.xPosOffset,
                        values.HEIGHT - values.barHeight,
                        0 - values.barWidth,
                        values.barHeight
                    );
                }
                else if(visualizer.startsFrom === 'Edges') {
                    if(values.xPosOffset > values.halfWidth) break;
                    ctx.fillRect( // Draws rect from left to right, from left to center
                        values.xPosOffset,
                        values.HEIGHT - values.barHeight,
                        values.barWidth,
                        values.barHeight
                    );
                }
                values.xPosOffset += values.barTotal;
            }
        }

        function secondDraw(maxBarHeight, i) {
            for(i; i < visualizer.bufferLength; i++) {
                values.barHeight = visualizer.audioData[i] * maxBarHeight;

                getBarColor(i);

                if(visualizer.startsFrom === 'Center') {
                    if(values.xPosOffset > values.WIDTH) break;
                    ctx.fillRect( // Draws rect from left to right, from center to right
                        values.xPosOffset,
                        values.HEIGHT - values.barHeight,
                        values.barWidth,
                        values.barHeight
                    );
                }
                else if(visualizer.startsFrom === 'Edges') {
                    if(values.xPosOffset > values.halfWidth) break;
                    ctx.fillRect( // Draws rect from left to right, from right to center
                        values.WIDTH - values.xPosOffset,
                        values.HEIGHT - values.barHeight,
                        values.barWidth,
                        values.barHeight
                    );
                }
                values.xPosOffset += values.barTotal;
            }
        }

        const canvases = {
            navbar: undefined,
            albumCover: undefined,
            background: undefined,
            playerBackground: undefined
        };
        async function setupVisualizer() {
        // Injecting visualizer canvases
            canvases.navbar = await injectElement('canvas', 'visualizerNavbarCanvas', globals.navBarBg, document, 'position: absolute; left: 0; top: 0; width: inherit; height: inherit; pointer-events: none;');
            canvases.albumCover = await injectElement('canvas', 'visualizerAlbumCoverCanvas', globals.mainPanel, document, 'position: absolute; z-index: 9999; pointer-events: none; visibility: visible; width: inherit; height: inherit;');
            globals.navBarBg.style.opacity = 1;
            canvases.background = await injectElement('canvas', 'visualizerBackgroundCanvas', document.getElementById('browse-page'), document, 'position: fixed; pointer-events: none; visibility: visible; width: 100%; height: 100vh;', true);
            canvases.playerBackground = await injectElement('canvas', 'visualizerPlayerBackgroundCanvas', document.getElementById('player-page'), document, 'position: absolute; pointer-events: none; visibility: visible; width: inherit; height: inherit;', true);
            if(GM_config.get('visualizerPlace') !== 'Disabled') getVideo();
        }

        let video;
        function getVideo() {
            video = document.querySelector('video');
            if(video) startVisualizer();
            else {
                logplus('warn', 'Query "video" not found, retrying in 100ms.');
                setTimeout(getVideo, 100);
            }
        }

        const values = {
            WIDTH: undefined,
            HEIGHT: 1,
            halfWidth: undefined,
            halfHeight: undefined,
            xPosOffset: undefined,
            barTotal: undefined,
            barWidth: undefined,
            barSpace: undefined,
            barHeight: undefined,
            circleSize: undefined,
            radius: 1,
            heightModifier: 1,
            innerRadius: undefined,
            outerRadius: undefined,
            rotationValue: 0,
            bass: undefined,
            bassSmoothRadius: 1,
            reactiveBarHeightMultiplier: undefined,
            startingPoint: -(0.5 * Math.PI)
        };

        let canvas, ctx;

        function startVisualizer() {
        // Init, connecting yt audio to canvas
            const context = new AudioContext();
            const src = context.createMediaElementSource(video);
            visualizer.analyser = context.createAnalyser();

            switch(visualizer.place) {
                case 'Navbar': default: canvas = canvases.navbar; break;
                case 'Album Cover': canvas = canvases.albumCover; break;
                case 'Background': canvas = canvases.playerBackground; break;
            }
            ctx = canvas.getContext('2d');

            src.connect(visualizer.analyser);
            visualizer.analyser.connect(context.destination);

            visualizer.getBufferData();
            visualizer.initValues();

            // Helps set the canvas size to the correct values (navbar width, rectangle or square album cover, etc)
            visualizer.resizeInterval = setInterval(() => {
                visualizerResizeFix();
            }, 1000);

            window.addEventListener('resize', visualizerResizeFix);

            replaceImageURL();
            requestAnimationFrame(renderFrame);
        }

        function visualizerResizeFix() {
            switch(canvas.id) {
                case canvases.navbar.id: {
                    logplus('Fixing NAVBAR');
                    if(canvas.width !== globals.navBarBg.offsetWidth) canvas.width = globals.navBarBg.offsetWidth;
                    if(canvas.height !== globals.navBarBg.offsetHeight) canvas.height = globals.navBarBg.offsetHeight;
                    break;
                }
                case canvases.albumCover.id: {
                    logplus('Fixing ALBUM COVER');
                    if(canvas.width !== globals.player.offsetWidth) canvas.width = globals.player.offsetWidth;
                    if(canvas.height !== globals.player.offsetHeight) canvas.height = globals.player.offsetHeight;

                    // if miniplayer == true
                    if(globals.player.playerPageOpen_ === false) {
                    // move the canvas over the miniplayer
                        canvas.style.bottom = getComputedStyle(globals.player).bottom;
                        canvas.style.left = getComputedStyle(globals.player).left;
                    }
                    else {
                    // completely remove properties because html
                        if(canvas.style.bottom !== '') canvas.style.removeProperty('bottom');
                        if(canvas.style.left !== '') canvas.style.removeProperty('left');
                    }
                    break;
                }
                case canvases.playerBackground.id: {
                    logplus('Fixing PLAYERBACKGROUND');
                    if(canvas.width !== canvases.playerBackground.offsetWidth) canvas.width = canvases.playerBackground.offsetWidth;
                    if(canvas.height !== canvases.playerBackground.offsetHeight) canvas.height = canvases.playerBackground.offsetHeight;
                    break;
                }
                case canvases.background.id: {
                    logplus('Fixing BACKGROUND');
                    if(canvas.width !== canvases.background.offsetWidth) canvas.width = canvases.background.offsetWidth;
                    if(canvas.height !== canvases.background.offsetHeight) canvas.height = canvases.background.offsetHeight;
                    break;
                }
            }

            values.WIDTH = canvas.width;
            values.halfWidth = values.WIDTH / 2;
            values.HEIGHT = canvas.height;
            values.halfHeight = values.HEIGHT / 2;

            // Fixes visualizer offset / Fixes album cover constantly getting smaller if brought to a smaller resolution display
            globals.player.style.margin = 'auto 0px';

            if(visualizer.circleEnabled === true && canvas.id !== canvases.navbar.id) {
                if(visualizer.bassBounce.enabled === false) {
                    values.radius = ~~(values.HEIGHT / 4);
                    values.heightModifier = (values.HEIGHT - values.radius) / 2 / 255;
                }
                else values.heightModifier = (values.HEIGHT - ~~(values.HEIGHT / 8)) / 2 / 255;

                values.barTotal = values.circleSize * Math.PI / (visualizer.bufferLength - 2 + values.circleSize);
                values.barWidth = values.barTotal * 0.45;
            }
            else {
                if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') values.barTotal = values.halfWidth / visualizer.bufferLength;
                else values.barTotal = values.WIDTH / visualizer.bufferLength;
                values.barSpace = values.barTotal * 0.05;
                values.barWidth = values.barTotal * 0.95;
            }
        }

        let lastFrameTime = 0;
        function renderFrame(time) { // Never remove time var from here
        // Don't do anything if True Pause energy saver is on and playback is paused
            if((visualizer.energySaver.type === 'True Pause' || visualizer.energySaver.type === 'Both') && video.paused === true) return requestAnimationFrame(renderFrame);

            // If render would be faster than max fps (60 by default if energy saver is off) come back later
            if(time - lastFrameTime < visualizer.energySaver._frameMinTime) return requestAnimationFrame(renderFrame);
            lastFrameTime = time;

            ctx.clearRect(0, 0, values.WIDTH, values.HEIGHT);

            if(visualizer.place === 'Disabled') return; // Kill everything if disabled, can be turned back with requestAnimationFrame(renderFrame), see GM's save event

            visualizer.analyser.getByteFrequencyData(visualizer.audioData); // Get audio data

            if(visualizer.rgb.enabled === true) { // Color cycle effect
                visualizer.rgb._data.push(visualizer.rgb._data[0]);
                visualizer.rgb._data.shift();
            }

            if(visualizer.place === 'Navbar') {
                if(canvas.id !== canvases.navbar.id) {
                    canvas = canvases.navbar;
                    ctx = canvas.getContext('2d');
                }
                visualizerNavbar();
            }
            else if(visualizer.place === 'Album Cover') {
                if(canvas.id !== canvases.albumCover.id) {
                    canvas = canvases.albumCover;
                    ctx = canvas.getContext('2d');
                }
                if(visualizer.circleEnabled === true) visualizerCircle();
                else visualizerNavbar();
            }
            else if(visualizer.place === 'Background') {
            // if miniplayer == true
                if(globals.player.playerPageOpen_ === false) {
                    if(canvas.id !== canvases.background.id) {
                        canvas = canvases.background;
                        ctx = canvas.getContext('2d');
                        logplus('Switched canvas to background');
                    }
                }
                else if(canvas.id !== canvases.playerBackground.id) {
                    canvas = canvases.playerBackground;
                    ctx = canvas.getContext('2d');
                    logplus('Switched canvas to playerBackground');
                }
                if(visualizer.circleEnabled === true) visualizerCircle();
                else visualizerNavbar();
            }

            requestAnimationFrame(renderFrame);
        }

        function getBarColor(i) {
            if(visualizer.rgb.enabled === true) {
                const color = ~~(i / visualizer.colorDivergence); // Limits iteration for rgb._data, so we don't go out of bounds but also use every color available
                if(visualizer.fade === true) ctx.fillStyle = `rgba(${visualizer.rgb._data[color].red}, ${visualizer.rgb._data[color].green}, ${visualizer.rgb._data[color].blue}, ${visualizer.audioData[i] < 128 ? visualizer.audioData[i] * 2 / 255 : 1.0})`;
                else ctx.fillStyle = `rgb(${visualizer.rgb._data[color].red}, ${visualizer.rgb._data[color].green}, ${visualizer.rgb._data[color].blue})`;
            }
            else if(visualizer.fade === true) ctx.fillStyle = visualizer.color + (visualizer.audioData[i] < 128 ? (visualizer.audioData[i] * 2).toString(16) : 'FF');
            else ctx.fillStyle = visualizer.color;

            if(visualizer.bassBounce.debug === true && i <= visualizer.bassBounce._barEnd && i >= visualizer.bassBounce._barStart) ctx.fillStyle = '#FFF';
        }

        function stylizeConfigWindow(doc, frame) {
            doc.body.style.overflow = 'hidden';
            frame.style.width = '60vw';
            frame.style.height = 'calc((3 / 4) * 60vw)';
            // frame.style.maxHeight = '75vh';
            frame.style.display = 'block';
            frame.style.margin = 'auto';
            frame.style.inset = '0';
            frame.style.boxShadow = '20px 20px 40px rgba(10, 10, 10, 0.8)';
            frame.style.border = '';
            frame.style.borderRadius = '1.5vw';
        }

        const titleSVG = // viewBox="0 0 613 99"
        `<svg>
        <g style="overflow:hidden; text-anchor: middle;">
            <defs>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="glow"/>
                    <feMerge>
                    <feMergeNode in="glow"/>
                    <feMergeNode in="glow"/>
                    <feMergeNode in="glow"/>
                    </feMerge>
                </filter>
            </defs>
            <text x="50%" y="50%" dy=".35em" text-anchor="middle">YTMPlus</text>
            <a href="https://github.com/RealMarioD/ytmplus" target="_blank"><text style="filter: url(#glow);" x="50%" y="50%" dy=".35em" text-anchor="middle">YTMPlus</text></a>
        </g>
    </svg>`;

        function manageUIv2(doc) {
            const wrapper = doc.getElementById('ytmPlusCfg_wrapper');

            // Get all categories and make category names into buttons
            const categorySelect = injectElement('div', 'categorySelect', wrapper, doc);
            const categories = doc.getElementsByClassName('section_header_holder');
            for(let i = 0; i < categories.length; i++) categorySelect.innerHTML += `<input type="button" class="changeCategoryButton" value="${categories[i].children[0].innerHTML}">`;

            // Handle changeCategoryButtons
            const changeCategoryButton = doc.getElementsByClassName('changeCategoryButton');
            let lastOpenSetting;
            for(let i = 0; i < changeCategoryButton.length; i++) {
                changeCategoryButton[i].addEventListener('click', () => {
                    for(let j = 0; j < changeCategoryButton.length; j++) changeCategoryButton[j].disabled = false;
                    changeCategoryButton[i].disabled = true; // "Disable" current button for styling
                    const currentSetting = doc.getElementById('ytmPlusCfg_section_' + i);
                    if(lastOpenSetting) lastOpenSetting.style = 'display: none;'; // Make last open category disappear
                    lastOpenSetting = currentSetting;
                    currentSetting.style = 'display: block;'; // Make selected category appear
                });
            }

            const currentSettings = injectElement('div', 'currentSettings', wrapper, doc);
            categorySelect.prepend(wrapper.childNodes[0]); // Put header (title) into categorySelect
            categorySelect.append(wrapper.childNodes[wrapper.childNodes.length - 3]); // Put save/close buttons into categorySelect
            const resetDiv = doc.getElementsByClassName('reset_holder block')[0];
            categorySelect.append(resetDiv); // Put reset button into categorySelect

            for(let i = 0, len = wrapper.childNodes.length - 2; i < len; i++) { // - 2: skip categorySelect and currentSettings
                const configVars = wrapper.childNodes[0];
                configVars.style = 'display: none;'; // Set category to invisible
                configVars.removeChild(configVars.firstElementChild);
                currentSettings.appendChild(configVars); // Move category to currentSettings and await to be visible
            }
        }

        function openEvent(doc, win, frame) { // open function is mostly customizing settings UI
            stylizeConfigWindow(doc, frame);

            // Every color input we want has to be 'manually set' (GM_config's customType would come in handy but how the hell do it work)
            const colorTypeFields = [
                'bgColor',
                'bgGradient',
                'clockColor',
                'clockGradientColor',
                'visualizerColor'
            ];
            for(let i = 0; i < colorTypeFields.length; i++) doc.getElementById('ytmPlusCfg_field_' + colorTypeFields[i]).type = 'color';

            manageUIv2(doc);

            // Live change for input tags + Adding info to int/float settings
            const inputs = doc.getElementsByTagName('input');
            for(let i = 0; i < inputs.length; i++) {
                inputs[i].addEventListener('change', () => GM_config.save());
                if(!isNaN(parseInt(inputs[i].value, 10))) {
                    const fieldSettings = GM_config.fields[inputs[i].id.split('_')[2]].settings;
                    inputs[i].title = `type: ${fieldSettings.type} | default: ${fieldSettings.default} | ${fieldSettings.min} . . ${fieldSettings.max}`;
                }
            }
            // Live change for select tags
            const selects = doc.getElementsByTagName('select');
            for(let i = 0; i < selects.length; i++) selects[i].addEventListener('change', () => GM_config.save());
            // Live change for textarea tags
            const textareas = doc.getElementsByTagName('textarea');
            for(let i = 0; i < textareas.length; i++) textareas[i].addEventListener('change', () => GM_config.save());

            // Header title svg
            const title = doc.getElementById('ytmPlusCfg_header');
            // eslint-disable-next-line no-undef
            title.innerHTML = titleSVG + `<span style="-webkit-text-fill-color: white; font-size: 3vh;">${vNumber}</span>`; // vNumber hacked in with metadataBuilder

            doc.addEventListener('keydown', event => {
                if(event.key == 'Escape') GM_config.close();
            });

            globals.settingsOpen = true;
        }

        function closeEvent() {
            globals.settingsOpen = false;
        }

        function saveEvent(oldVisPlace, newVisPlace) {
        // Updates updateable stuff on save
            changeBackground(GM_config.get('bg'));

            clockEnable(GM_config.get('clock'));

            afkEnable(GM_config.get('noAfk'));

            promoEnable(GM_config.get('noPromo'));

            skipDisliked(GM_config.get('skipDisliked'));

            extraButtons(GM_config.get('extraButtons'));

            fixLayout(GM_config.get('padding'));

            removeThumbnail(GM_config.get('removeThumbnail'));

            swapMainPanelWithPlaylist(GM_config.get('swapMainPanelWithPlaylist'));

            oldVisPlace = visualizer.place;
            newVisPlace = GM_config.get('visualizerPlace');

            if(newVisPlace !== 'Disabled') {
                if(visualizer.analyser === undefined) return getVideo(); // visualizer was surely not turned on this session, start like usual
                visualizer.getBufferData();
                visualizer.initValues();
                if(oldVisPlace === 'Disabled') requestAnimationFrame(renderFrame); // We have an analyser, visualizer was already initialized, resume
                else replaceImageURL();
            }
            else visualizer.place = 'Disabled';

            window.dispatchEvent(new Event('resize'));
        }

        const GM_config = new GM_configStruct({
            id: 'ytmPlusCfg',
            title: 'ytmPlus',
            fields: configFields,
            css: configCSS,
            events: {
                open: (doc, win, frame) => openEvent(doc, win, frame),
                close: () => closeEvent(),
                save: () => saveEvent()
            }
        });

        const globals = {
            settingsOpen: false, // Used to track if config window is open or not
            playerPage: undefined,
            playerPageDiv: undefined, // Set to the player "overlay" in window.onload
            player: undefined, // Has the sizes we need for album cover canvas
            upgradeButton: undefined, // Set to the upgrade "button" in window.onload
            originalUpgradeText: undefined, // OGUpgrade text can differ based on YTM language
            clockFunction: undefined, // Holds the interval function that updates the digital clock
            noAfkFunction: undefined, // Holds the anti-afk interval function
            noPromoFunction: undefined, // Holds the no promotions function
            skipDislikedFunction: undefined, // Holds the skip disliked songs function
            dumbFix: 0, // idek what to type here, DOMSubtreeModified fires twice, this helps code run only once lmao
            navBarBg: undefined, // Holds the navbar bg's div, visualizer canvas is injected into its innerHTML
            mainPanel: undefined, // Holds something from around the album cover, - - | | - -
        };

        const visualizer = {
            place: undefined,
            startsFrom: undefined,
            color: undefined,
            fade: undefined,
            circleEnabled: undefined,
            rotate: undefined,
            rotateDirection: undefined,
            move: undefined,
            energySaver: {
                type: undefined,
                fps: undefined,
                _frameMinTime: undefined,
                _getFMT: function(fps) { visualizer.energySaver._frameMinTime = (1000 / 60) * (60 / fps) - (1000 / 60) * 0.5; }
            },
            image: {
                type: undefined,
                customURL: undefined
            },
            rgb: {
                enabled: undefined,
                red: undefined,
                green: undefined,
                blue: undefined,
                samples: undefined,
                _data: []
            },
            bassBounce: {
                enabled: undefined,
                minHertz: undefined,
                maxHertz: undefined,
                smooth: undefined,
                debug: undefined,
                _barStart: undefined,
                _barEnd: undefined,
                _calcBars() {
                    this._barStart = ~~(this.minHertz / (44100 / visualizer.analyser.fftSize));
                    this._barEnd = ~~(this.maxHertz / (44100 / visualizer.analyser.fftSize));
                    if(this._barEnd === 0) this._barEnd++;
                }
            },
            keepHertz: undefined,
            colorDivergence: undefined,
            analyser: undefined,
            bufferLength: undefined,
            audioData: undefined,
            resizeInterval: undefined,
            getBufferData() {
                this.analyser.fftSize = GM_config.get('visualizerFft');
                this.keepHertz = GM_config.get('visualizerKeepHertz');
                this.bufferLength = ~~(this.keepHertz / (44100 / visualizer.analyser.fftSize));
                this.audioData = new Uint8Array(this.bufferLength);
            },
            /**
         * Visualizer keys must have identical names with their GM_config equivalent, e.g.: visualizer.place = 'visualizerPlace'
         * Following this rule we can iterate through the visualizer object and automatically get all configs and their values.
         * (bassBounce is the last thing it checks so any values that should be initialised/changed upon saving should be set above bassBounce)
         */
            initValues() {
                for(const key in this) {
                    let gmName;

                    if(typeof this[key] !== 'object') {
                        gmName = 'visualizer' + key[0].toUpperCase() + key.slice(1, key.length); // e.g.: visualizer + P + lace
                        this[key] = GM_config.get(gmName);
                        continue;
                    }

                    for(const key2 in this[key]) {
                        if(key2[0] === '_') continue;
                        gmName = 'visualizer' +
                    key[0].toUpperCase() + key.slice(1, key.length) + // B + assBounce
                    key2[0].toUpperCase() + key2.slice(1, key2.length); // E + nabled

                        this[key][key2] = GM_config.get(gmName);
                    }

                    if(key !== 'bassBounce') continue;

                    // Last things to do (everything here runs only once)
                    if(this.analyser !== undefined) {
                        this.analyser.smoothingTimeConstant = GM_config.get('visualizerSmoothing');
                        this.analyser.minDecibels = GM_config.get('visualizerMinDecibels');
                        this.analyser.maxDecibels = GM_config.get('visualizerMaxDecibels');
                        this.bassBounce._calcBars();
                    }

                    this.colorDivergence = this.bufferLength / this.rgb.samples;
                    if(this.rgb.enabled === true && this.rgb._data.length !== this.rgb.samples) this.getRGB();

                    if(this.energySaver.type === 'Limit FPS' || this.energySaver.type === 'Both') this.energySaver._getFMT(this.energySaver.fps);
                    else this.energySaver._getFMT(60);

                    clearInterval(visualizer.resizeInterval);
                    if(this.place !== 'Disabled') visualizer.resizeInterval = setInterval(() => visualizerResizeFix(), 1000);
                    return; // So we don't check anything beyond bassBounce
                }
            },
            getRGB() { // Pregenerates RGB colors so we don't have to calculate colors every frame
                const hue = 2 * Math.PI / this.rgb.samples,
                    piD3 = Math.PI / 3, // Offset
                    piD3x2 = 2 * Math.PI / 3; // so that colors aren't totally mixed together

                this.rgb._data = [];
                for(let i = 0; i < this.rgb.samples; i++) {
                    this.rgb._data[i] = {
                        red: Math.abs(this.rgb.red * Math.sin(i * hue)),
                        green: Math.abs(this.rgb.green * Math.sin(i * hue + piD3)),
                        blue: Math.abs(this.rgb.blue * Math.sin(i * hue + piD3x2))
                    };
                }
            }
        };

        function keydownEvent(ev) {
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

        async function loadEvent() {
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

        window.addEventListener('keydown', (ev) => keydownEvent(ev));

        window.addEventListener('load', () => loadEvent());
    })();
}
catch (err) {
    console.error(err);
}
