// ==UserScript==
// @name         ytmPlus
// @version      2.1.1
// @author       Mario_D#7052
// @license      MIT
// @namespace    http://tampermonkey.net/
// @updateURL    https://github.com/RealMarioD/ytmplus/raw/main/ytmplus.user.js
// @downloadURL  https://github.com/RealMarioD/ytmplus/raw/main/ytmplus.user.js
// @description  ytmPlus is a userscript that adds multiple visual customizations to YouTube Music.
// @match        https://music.youtube.com/*
// @icon         https://imgur.com/gfg6VLJ.png
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

/**
 * == WARNING ==
 * This script was built by Rollup. It is not recommended to make changes in this file.
 * Visit the GitHub repo (https://github.com/RealMarioD/ytmplus), clone it, make changes then build the script.
 * Otherwise, have fun.
 */

(function() {
    'use strict';

    const configCSS =
`input[type="color"] {
    -webkit-appearance: none;
    border: none;
    padding: 0;
    width: 3.5vh;
    height: 3.5vh;
}
input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}
input[type="color"]::-webkit-color-swatch {
    border: 0;
}
input[type="color"], input[type="checkbox"] {
    width: 3.5vh;
    height: 3.5vh;
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
    width: 75%;
    height: 5vh;
    resize: none;
    margin: auto;
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
    margin: 0 0 1vh;
    text-align: center;
    height: 6vh;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}
#ytmPlusCfg * {
    font-family: monospace;
    color: rgba(255, 255, 255, 0.8);
}
#ytmPlusCfg {
    background-color: rgba(0, 0, 0, 0.9);
}
#ytmPlusCfg #ytmPlusCfg_header {
    background: -webkit-linear-gradient(-45deg, rgb(170, 25, 25), rgb(25, 25, 170));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 2vh 0;
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
    font-size: 3.5vh;
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
#ytmPlusCfg .reset {
    color: rgba(255, 255, 255, 0.8);
}
#ytmPlusCfg_wrapper {
    height: -webkit-fill-available;
}
::-webkit-scrollbar {
    width: 1vw;
    height: 0.5vh;
}
::-webkit-scrollbar-track {
    background: #eeea;
    border-radius: 2vw;
}
::-webkit-scrollbar-thumb {
    background: #888a;
    border-radius: 2vw;
}
::-webkit-scrollbar-thumb:hover {
    background: #555f;
}
#ytmPlusCfg_buttons_holder {
    text-align: center;
}
#ytmPlusCfg .saveclose_buttons {
    background-color: rgba(66, 66, 66, 0.8);
    font-size: 2.5vh;
    margin: 0.5vh;
    width: 47.5%;
    padding: 1vh;
    border: solid 3px transparent;
    border-radius: 1vh;
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #66003366, #33006666);
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 2px 1000px 1px #333 inset;
}
#ytmPlusCfg .saveclose_buttonsdisabled {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #dd0055ee, #5500ddee);
}
#ytmPlusCfg .saveclose_buttons:hover {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #ff0077ff, #7700ffff);
}
#ytmPlusCfg .saveclose_buttons:active {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #6600eecc, #ee0066cc);
}

#ytmPlusCfg .reset_holder {
    margin: 0.5vh;
}
#ytmPlusCfg .reset {
    font-size: 2vh;
}
svg {
    width: inherit;
    height: inherit;
    margin: auto;
}
svg text {
    font-size: 10vmin;
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
    width: 34vw;
    max-width: 34vw;
    justify-content: center;
    border-right: solid #6666;
    display: flex;
    flex-direction: column;
    padding: 0 4vh;
}
.changeCategoryButton {
    border: solid 3px transparent;
    border-radius: 1vh;
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #66003366, #33006666);
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 2px 1000px 1px #333 inset;
    padding-top: 0.5vh;
    padding-bottom: 0.5vh;
    margin-bottom: 2vh;
}
.changeCategoryButton:disabled {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #dd0055ee, #5500ddee);
}
.changeCategoryButton:hover {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #ff0077ff, #7700ffff);
}
.changeCategoryButton:active {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #6600eecc, #ee0066cc);
}
#currentSettings {
    width: -webkit-fill-available;
    overflow: overlay;
    justify-content: center;
    display: flex;
    flex-direction: column;
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
        bg: { english: 'Change Background', hungarian: 'Háttér megváltoztatása' },
        bgSection: { english: 'Background Settings', hungarian: 'Háttér beállítások' },
        bgColor: { english: 'Background Color', hungarian: 'Háttérszín' },
        bgEnableGradient: { english: 'Enable Gradient', hungarian: 'Háttér színátmenet engedélyezése' },
        bgGradient: { english: 'Background Gradient Color', hungarian: 'Háttér színátmenet' },
        clock: { english: 'Change "Upgrade" Button', hungarian: '"Bővítés" Gomb Cserélése' },
        clockSection: { english: 'Upgrade Button', hungarian: 'Bővítés Gomb' },
        clockColor: { english: 'Clock Color', hungarian: 'Óra Színe' },
        clockGradient: { english: 'Enable Gradient', hungarian: 'Színátmenet Engedélyezése' },
        clockGradientColor: { english: 'Gradient Color', hungarian: 'Színátmenet' },
        visualizerPlace: { english: 'Visualizer Place', hungarian: 'Vizualizáló Helye' },
        visualizerPlaceSection: { english: 'Music Visualizer', hungarian: 'Zene Vizualizáló' },
        visualizerStartsFrom: { english: 'Visualizer Starts from', hungarian: 'Vizualizáló innen kezdődik:' },
        // visualizerStartsFromOptions: { english: ['Left', 'Center', 'Right', 'Edges'], hungarian: ['Bal', 'Közép', 'Jobb', 'Szélek'] },
        visualizerColor: { english: 'Visualizer Color', hungarian: 'Vizualizáló Színe' },
        visualizerRgbEnabled: { english: 'RGB Mode', hungarian: 'RGB Mód' },
        visualizerFade: { english: 'Enable Bar Fade', hungarian: 'Sávok Áttűnésének Engedélyezése' },
        visualizerFft: { english: 'Bar Amount<span title="High values can affect performance and can break circle visualizer.">⚠️</span>', hungarian: 'Sáv mennyiség<span title="Magas értékek befolyásolhatják a teljesítményt és hibát okozhatnak a kör vizualizálóban.">⚠️</span>' },
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
        visualizerSmoothing: { english: 'Smoothing Time Constant', hungarian: 'Simítási időállandó' },
        visualizerCutOff: { english: 'AudioData End Cutoff', hungarian: 'AudioData Vég Levágás' },
        visualizerBassBounceSensitivityStart: { english: 'Bass Bounce Sensitivity Start', hungarian: 'Basszusugrálás Érzékenység Kezdőérték' },
        visualizerBassBounceSensitivityEnd: { english: 'Bass Bounce Sensitivity End', hungarian: 'Basszusugrálás Érzékenység Végérték' },
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
            default: true
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
        visualizerPlace: {
            label: fieldTexts.visualizerPlace[langOption],
            section: fieldTexts.visualizerPlaceSection[langOption],
            type: 'select',
            options: ['Disabled', 'Navbar', 'Album Cover'],
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
            default: false
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
            min: 0.0,
            max: 1.0,
            default: 0.5
        },
        visualizerCutOff: {
            label: fieldTexts.visualizerCutOff[langOption],
            type: 'float',
            min: 0,
            max: 0.9999,
            default: 0.1625
        },
        visualizerBassBounceSensitivityStart: {
            label: fieldTexts.visualizerBassBounceSensitivityStart[langOption],
            type: 'float',
            min: 0,
            max: 1,
            default: 0
        },
        visualizerBassBounceSensitivityEnd: {
            label: fieldTexts.visualizerBassBounceSensitivityEnd[langOption],
            type: 'float',
            min: 0.00001,
            max: 1,
            default: 0.004
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

    function promoEnable(turnOn) {
        let popup;
        clearInterval(globals.noPromoFunction);
        if(!turnOn) return;
        globals.noPromoFunction = setInterval(() => {
            popup = document.getElementsByTagName('ytmusic-mealbar-promo-renderer');
            if(popup.length > 0) {
                popup[0].remove();
                console.log('ytmPlus: Removed a promotion.');
            }
        }, 1000);
    }

    function afkEnable(turnOn) { // Credit to q1k - https://greasyfork.org/en/users/1262-q1k
        clearInterval(globals.noAfkFunction);
        if(!turnOn) return;
        globals.noAfkFunction = setInterval(() => {
            document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 }));
            console.log('ytmPlus: Nudged the page so user is not AFK.');
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
        const a = globals.upgradeButton.style;
        a.background = mode != 'Digital Clock' ? '' : `linear-gradient(to right, ${GM_config.get('clockColor')} 0%, ${GM_config.get('clockGradient') === true ? GM_config.get('clockGradientColor') : GM_config.get('clockColor')} 50%, ${GM_config.get('clockColor')} 100%`;
        a.backgroundSize = mode != 'Digital Clock' ? '' : '200% auto';
        a.backgroundClip = mode != 'Digital Clock' ? '' : 'text';
        a.textFillColor = mode != 'Digital Clock' ? '' : 'transparent';
        a.webkitBackgroundClip = mode != 'Digital Clock' ? '' : 'text';
        a.webkitTextFillColor = mode != 'Digital Clock' ? '' : 'transparent';
        a.fontSize = mode != 'Digital Clock' ? '20px' : '50px';
        a.animation = mode != 'Digital Clock' ? '' : 'clockGradient 2s linear infinite normal';
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
        addFancy(document.body.style, true);
        addFancy(globals.playerPageDiv.style);
    }

    function addFancy(e, overflowOn) {
        e.backgroundImage = `linear-gradient(45deg, ${GM_config.get('bgColor')}, ${GM_config.get('bgEnableGradient') == true ? GM_config.get('bgGradient') : GM_config.get('bgColor')})`;
        e.animation = 'backgroundGradient 5s linear infinite alternate';
        e.backgroundSize = '150% 150%';
        e.backgroundAttachment = 'fixed';
        // e.height = '100vh';
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
        if(!turnOn) {
            playbackButtons[1].hidden = true;
            playbackButtons[4].hidden = true;
        }
        else {
            playbackButtons[1].hidden = false;
            playbackButtons[4].hidden = false;
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
        globals.player.style.backgroundColor = '#01010101';
        const songImage = document.getElementById('song-image');
        setTimeout(() => {
            if(!turnOn) songImage.style.opacity = 1;
            else songImage.style.opacity = 0.001;
        }, 500);
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

    const image = new Image();
    let imgLoaded = false,
        currentURL;

    image.onload = () => {
        imgLoaded = true;
    };
    image.onerror = () => {
        if(visualizer.image.type === 'Thumbnail' && currentURL.indexOf('data') === 0) return;
        console.warn('ytmPlus: Custom Image couldn\'t be loaded.');
        currentURL = 'https://imgur.com/Nkj0d6D.png';
        visualizer.image.customURL = currentURL;
    };


    function handleImage(ctx) {
        if(visualizer.image.type === 'Thumbnail') currentURL = document.getElementById('thumbnail').firstElementChild.src;
        else currentURL = visualizer.image.customURL;

        if(image.src !== currentURL) {
            imgLoaded = false;
            image.src = currentURL;
        }

        if(imgLoaded === true) drawVisImage(ctx);
    }

    function drawVisImage(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(values.WIDTH / 2, values.HEIGHT / 2, values.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(image, values.halfWidth - values.radius, values.halfHeight - values.radius, values.radius * 2, values.radius * 2);
        ctx.restore();
    }


    function visualizerCircle(ctx) { // Bitwise truncation (~~number) is used here instead of Math.floor() to squish out more performance.
        if(visualizer.startsFrom === 'Left' || visualizer.startsFrom === 'Right') values.circleSize = 2; // 2(pi) = full
        else values.circleSize = 1; // 1(pi) = half;

        if(visualizer.bassBounce.enabled === true ||
            visualizer.rotate === 'Reactive (Bass)') calculateBass();

        getRotationValue();

        if(visualizer.image.type !== 'Disabled') handleImage(ctx);

        values.barTotal = values.circleSize * Math.PI / visualizer.bufferLength;
        values.barWidth = values.barTotal * 0.45;
        // No need for barSpace
        values.reactiveBarHeightMultiplier = 0.3 + values.bassSmoothRadius / 512; // 0.3 . . 0.55

        if(visualizer.startsFrom === 'Right') drawArcs(false, ctx);
        else if(visualizer.startsFrom === 'Left') drawArcs(true, ctx);
        else if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') {
            drawArcs(false, ctx);
            drawArcs(true, ctx);
        }
    }

    function calculateBass() {
        values.bass = visualizer.dataArray.slice(
            ~~(visualizer.dataArray.length * visualizer.bassBounce.sensitivityStart),
            ~~(visualizer.dataArray.length * visualizer.bassBounce.sensitivityEnd) + 1
        );

        if(visualizer.bassBounce.smooth === true) values.bassSmoothRadius = ~~((values.bassSmoothRadius + (averageOfArray(values.bass) / 2)) / 2);
        else values.bassSmoothRadius = ~~(averageOfArray(values.bass) / 2);

        if(visualizer.bassBounce.enabled === true) values.radius = ~~(values.HEIGHT / 8) + values.bassSmoothRadius * values.heightModifier * 1.25;
    }

    function getRotationValue() {
        const r = visualizer.rotate,
            direction = (visualizer.rotateDirection === 'Clockwise') ? 1 : -1;

        if(r === 'Disabled') values.rotationValue = 0;
        else if(r === 'On') values.rotationValue += 0.005 * direction;
        else if(r === 'Reactive') values.rotationValue += (Math.pow(averageOfArray(visualizer.dataArray) / 10000 + 1, 2) - 1) * direction;
        else if(r === 'Reactive (Bass)') values.rotationValue += (Math.pow(values.bassSmoothRadius / 10000 + 1, 2) - 1) * direction;
    }

    function drawArcs(backwards, ctx) {
        ctx.save();
        ctx.translate(values.halfWidth, values.halfHeight); // move to center of circle
        ctx.rotate(values.startingPoint + values.rotationValue); // Set bar starting point to top + rotation

        for(let i = 0; i < visualizer.bufferLength; ++i) {
            if(i === 0 && backwards === true) {
                ctx.rotate(-values.barTotal);
                continue;
            }

            getBarColor(i);

            if(visualizer.bassBounce.debug === true && i < values.bass.length && i >= ~~(visualizer.bufferLength * visualizer.bassBounce.sensitivityStart)) ctx.fillStyle = '#FFF';

            if(visualizer.bassBounce.enabled === true) values.barHeight = visualizer.dataArray[i] * values.heightModifier * values.reactiveBarHeightMultiplier;
            else values.barHeight = visualizer.dataArray[i] * values.heightModifier * 0.5;

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

    function visualizerNavbar(ctx) {
        if(visualizer.startsFrom === 'Center') values.xPosOffset = values.barWidth / 2; // Centers 1 bar
        else if(visualizer.startsFrom === 'Edges') values.xPosOffset = values.barSpace / 2; // Both sides are offset a bit for perfect centering
        else values.xPosOffset = 0;

        const maxBarHeight = (values.HEIGHT / 255);

        firstDraw(ctx, maxBarHeight);

        if(visualizer.startsFrom === 'Center') {
            values.xPosOffset = values.halfWidth + values.barWidth / 2 + values.barSpace; // Reset pos to center + skip first bar
            secondDraw(ctx, maxBarHeight, 1);
        }
        else if(visualizer.startsFrom === 'Edges') {
            values.xPosOffset = values.barWidth + (values.barSpace / 2); // Reset pos to right + offset for perfect center
            secondDraw(ctx, maxBarHeight, 0);
        }
    }

    function firstDraw(ctx, maxBarHeight) {
        for(let i = 0; i < visualizer.bufferLength; i++) {
            values.barHeight = visualizer.dataArray[i] * maxBarHeight;

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

    function secondDraw(ctx, maxBarHeight, i) {
        for(i; i < visualizer.bufferLength; i++) {
            values.barHeight = visualizer.dataArray[i] * maxBarHeight;

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

    let video;
    function getVideo() {
        video = document.querySelector('video');
        if(video) startVisualizer();
        else {
            console.warn('ytmPlus: Query "video" not found, retrying in 100ms.');
            setTimeout(() => { getVideo(); }, 100);
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
            case 'Navbar': default: canvas = document.getElementById('visualizerNavbarCanvas'); break;
            case 'Album Cover': canvas = document.getElementById('visualizerAlbumCoverCanvas'); break;
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

        requestAnimationFrame(renderFrame);
    }

    function visualizerResizeFix() {
        switch(visualizer.place) {
            case 'Navbar': default:
                canvas.width = globals.navBarBg.offsetWidth;
                canvas.height = globals.navBarBg.offsetHeight;
                canvas.style.width = '';
                canvas.style.height = '';
                values.WIDTH = canvas.width;
                values.halfWidth = values.WIDTH / 2;
                values.HEIGHT = canvas.height;

                if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') values.barTotal = values.halfWidth / visualizer.bufferLength;
                else values.barTotal = values.WIDTH / visualizer.bufferLength;
                values.barSpace = values.barTotal * 0.05;
                values.barWidth = values.barTotal * 0.95;
                break;
            case 'Album Cover':
                canvas.style.width = globals.player.offsetWidth + 'px';
                canvas.style.height = globals.player.offsetHeight + 'px';
                if(canvas.width !== globals.player.offsetWidth) canvas.width = globals.player.offsetWidth;
                if(canvas.height !== globals.player.offsetHeight) canvas.height = globals.player.offsetHeight;
                values.WIDTH = canvas.width;
                values.halfWidth = values.WIDTH / 2;
                values.HEIGHT = canvas.height;
                values.halfHeight = values.HEIGHT / 2;

                if(globals.player.playerPageOpen_ === false) { // if miniplayer == true
                    canvas.style.bottom = getComputedStyle(globals.player).bottom; // move the canvas over the miniplayer
                    canvas.style.left = getComputedStyle(globals.player).left;
                }
                else {
                    canvas.style.removeProperty('bottom'); // else completely remove properties because html
                    canvas.style.removeProperty('left');
                }

                if(visualizer.circleEnabled === false) {
                    if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') values.barTotal = values.halfWidth / visualizer.bufferLength;
                    else values.barTotal = values.WIDTH / visualizer.bufferLength;
                    values.barSpace = values.barTotal * 0.05;
                    values.barWidth = values.barTotal * 0.95;
                }
                else if(visualizer.bassBounce.enabled === false) {
                    values.radius = ~~(values.HEIGHT / 4);
                    values.heightModifier = (values.HEIGHT - values.radius) / 2 / 255;
                }
                else values.heightModifier = (values.HEIGHT - ~~(values.HEIGHT / 8)) / 2 / 255;
                break;
            case 'Disabled': break;
        }
    }

    let lastFrameTime = 0;
    function renderFrame(time) {
        if(time - lastFrameTime < visualizer.energySaver._frameMinTime) return requestAnimationFrame(renderFrame);
        lastFrameTime = time;

        if((visualizer.energySaver.type === 'True Pause' || visualizer.energySaver.type === 'Both') && video.paused === true) return requestAnimationFrame(renderFrame);

        ctx.clearRect(0, 0, values.WIDTH, values.HEIGHT);

        if(visualizer.place === 'Disabled') return;

        visualizer.analyser.getByteFrequencyData(visualizer.dataArray); // Get audio data

        if(visualizer.rgb.enabled === true) { // Color cycle effect
            visualizer.rgbData.push(visualizer.rgbData[0]);
            visualizer.rgbData.shift();
        }

        if(visualizer.place === 'Navbar') {
            if(canvas.id !== 'visualizerNavbarCanvas') {
                canvas = document.getElementById('visualizerNavbarCanvas');
                ctx = canvas.getContext('2d');
            }
            visualizerNavbar(ctx);
        }
        else if(visualizer.place === 'Album Cover') {
            if(canvas.id !== 'visualizerAlbumCoverCanvas') {
                canvas = document.getElementById('visualizerAlbumCoverCanvas');
                ctx = canvas.getContext('2d');
            }
            if(visualizer.circleEnabled === true) visualizerCircle(ctx);
            else visualizerNavbar(ctx);
        }

        requestAnimationFrame(renderFrame);
    }

    function getBarColor(i) {
        if(visualizer.rgb.enabled === true) {
            const color = ~~(i / visualizer.colorDivergence);
            if(visualizer.fade === true) ctx.fillStyle = `rgba(${visualizer.rgbData[color].red}, ${visualizer.rgbData[color].green}, ${visualizer.rgbData[color].blue}, ${visualizer.dataArray[i] < 128 ? visualizer.dataArray[i] * 2 / 255 : 1.0})`;
            else ctx.fillStyle = `rgb(${visualizer.rgbData[color].red}, ${visualizer.rgbData[color].green}, ${visualizer.rgbData[color].blue})`;
        }
        else if(visualizer.fade === true) ctx.fillStyle = visualizer.color + (visualizer.dataArray[i] < 128 ? (visualizer.dataArray[i] * 2).toString(16) : 'FF');
        else ctx.fillStyle = visualizer.color;
    }

    function stylizeConfigWindow(doc, frame) {
        doc.body.style.overflow = 'hidden';
        frame.style.width = '50vw';
        // frame.style.height = // '80vh';
        frame.style.maxHeight = '75vh';
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
                    <feGaussianBlur stdDeviation="10" result="glow"/>
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

    function injectElement(type, id, wrapperId, doc) {
        const node = doc.createElement(type);
        node.id = id;
        const wrapper = doc.getElementById(wrapperId);
        if(!wrapper) throw new Error(`Wrapper Error: no element with id "${wrapperId}"`);
        wrapper.appendChild(node);
        return node;
    }

    function manageUIV2(doc) {
        injectElement('div', 'cfgHolder', 'ytmPlusCfg_wrapper', doc);

        const categorySelect = injectElement('div', 'categorySelect', 'cfgHolder', doc);
        const categories = doc.getElementsByClassName('section_header_holder');

        for(let i = 0; i < categories.length; i++) categorySelect.innerHTML += `<input type="button" class="changeCategoryButton" value="${categories[i].children[0].innerHTML}">`;

        const changeCategoryButton = doc.getElementsByClassName('changeCategoryButton');
        let lastOpenSetting;
        for(let i = 0; i < changeCategoryButton.length; i++) {
            changeCategoryButton[i].addEventListener('click', () => {
                for(let j = 0; j < changeCategoryButton.length; j++) changeCategoryButton[j].disabled = false;
                changeCategoryButton[i].disabled = true;
                const currentSetting = doc.getElementById('ytmPlusCfg_section_' + i);
                if(lastOpenSetting) lastOpenSetting.style = 'display: none;';
                lastOpenSetting = currentSetting;
                currentSetting.style = 'display: block;';
            });
        }

        const currentSettings = injectElement('div', 'currentSettings', 'cfgHolder', doc);

        const wrapper = doc.getElementById('ytmPlusCfg_wrapper');
        categorySelect.prepend(wrapper.childNodes[0]); // Put header (title) into categorySelect
        categorySelect.append(wrapper.childNodes[wrapper.childNodes.length - 2]); // Put save/close buttons into categorySelect

        for(let i = 0, len = wrapper.childNodes.length - 1; i < len; i++) { // - 1: skip cfgHolder
            const e = wrapper.childNodes[0];
            e.style = 'display: none;'; // Set category to invisible
            e.removeChild(e.firstElementChild);
            currentSettings.appendChild(e); // Move category to currentSettings and await to be visible
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

        manageUIV2(doc);

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
        title.innerHTML = titleSVG;

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

        oldVisPlace = visualizer.place;
        newVisPlace = GM_config.get('visualizerPlace');

        if(newVisPlace !== 'Disabled') {
            if(visualizer.analyser === undefined) return getVideo();
            visualizer.getBufferData();
            visualizer.initValues();
            if(oldVisPlace === 'Disabled') requestAnimationFrame(renderFrame);
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
            samples: undefined
        },
        bassBounce: {
            enabled: undefined,
            sensitivityStart: undefined,
            sensitivityEnd: undefined,
            smooth: undefined,
            debug: undefined
        },
        cutOff: undefined,
        rgbData: [],
        colorDivergence: undefined,
        analyser: undefined,
        bufferLength: undefined,
        dataArray: undefined,
        resizeInterval: undefined,
        getBufferData() {
            this.analyser.fftSize = GM_config.get('visualizerFft');
            this.cutOff = GM_config.get('visualizerCutOff');
            this.bufferLength = this.analyser.frequencyBinCount - Math.floor(this.analyser.frequencyBinCount * this.cutOff); // We cut off the end because data is 0, making visualizer's end flat
            this.dataArray = new Uint8Array(this.bufferLength);
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

                if(this.analyser !== undefined) {
                    this.analyser.smoothingTimeConstant = GM_config.get('visualizerSmoothing');
                    this.analyser.minDecibels = GM_config.get('visualizerMinDecibels');
                    this.analyser.maxDecibels = GM_config.get('visualizerMaxDecibels');
                }

                this.colorDivergence = this.bufferLength / this.rgb.samples;
                if(this.rgb.enabled === true && this.rgbData.length !== this.rgb.samples) this.getRGB();

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

            this.rgbData = [];
            for(let i = 0; i < this.rgb.samples; i++) {
                this.rgbData[i] = {
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

    function loadEvent() {
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
        node.style = 'top: 7px; left: 100px; height: 50px; opacity: 1; overflow: auto; padding: 0px; position: fixed; width: 50px; z-index: 9999; overflow: hidden;';
        document.body.appendChild(node);
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
    }

    window.addEventListener('keydown', (ev) => keydownEvent(ev));

    window.addEventListener('load', () => loadEvent());
})();
