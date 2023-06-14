// ==UserScript==
// @name         ytmPlus
// @version      Alpha3.0.0
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
const vNumber = 'vAlpha3.0.0';
try {
    (function() {
        'use strict';

        const settingsMenu = '@media screen and (max-height: 768px) {\r\n    #ytmPlusCfg {\r\n        height: 512px;\r\n        font-size: 12px;\r\n    }\r\n}\r\n@media screen and (min-height: 769px) {\r\n    #ytmPlusCfg {\r\n        height: 768px;\r\n        font-size: 18px;\r\n    }\r\n}\r\n\r\n#ytmPlusCfg {\r\n    background-color: rgba(0, 0, 0, 0.925);\r\n    box-shadow: 20px 20px 40px rgba(10, 10, 10, 0.8);\r\n    border: 0;\r\n    border-radius: 1%;\r\n    /* GM_config sets a lot of things to element, we can only change it in JS no? */\r\n}\r\n\r\n#ytmPlusCfg * {\r\n    font-family: monospace;\r\n    color: rgba(255, 255, 255, 0.8);\r\n}\r\n\r\n#ytmPlusCfg_wrapper {\r\n    display: flex;\r\n    height: inherit;\r\n    flex-direction: row;\r\n    flex-wrap: wrap;\r\n    align-content: flex-start;\r\n    justify-content: space-evenly;\r\n}\r\n\r\n#ytmPlusCfg_titlebar {\r\n    display: flex;\r\n    flex-direction: row-reverse;\r\n    background-color: rgb(66, 66, 66, 0.925);\r\n    width: 100%;\r\n    height: 7.68%;\r\n    align-items: center;\r\n}\r\n\r\n#titlebar_x {\r\n    font-size: 1.5em;\r\n    padding: 0;\r\n    height: 100%;\r\n    aspect-ratio: 1;\r\n    border-radius: 0;\r\n    border-left: 1px solid rgba(0, 0, 0, 0.925);\r\n    transition: 100ms linear;\r\n}\r\n\r\n#titlebar_x:hover {\r\n    background-color: rgb(170, 25, 25);\r\n}\r\n\r\n#supportMePls {\r\n    height: 100%;\r\n    aspect-ratio: 1;\r\n    border-left: 1px solid rgba(0, 0, 0, 0.925);\r\n    transition: 100ms linear;\r\n}\r\n\r\n#supportMePls:hover {\r\n    background: #00CAFE;\r\n}\r\n\r\n#goToKofi {\r\n    height: 100%;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n#supportMePls img {\r\n    height: 100%;\r\n}\r\n\r\n#titlebar_draggable {\r\n    width: 100%;\r\n    height: 100%;\r\n    cursor: move;\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: center;\r\n}\r\n\r\n#titlebar_icon {\r\n    height: 80%;\r\n    margin: 0 0.675%;\r\n}\r\n\r\n#sideBySide {\r\n    display: flex;\r\n    flex-direction: column;\r\n    flex-wrap: wrap;\r\n    width: 100%;\r\n    height: calc(100% - 52px);\r\n    align-content: space-evenly;\r\n}\r\n\r\n#categorySelect {\r\n    width: 40%;\r\n    justify-content: space-evenly;\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 100%;\r\n    flex-wrap: wrap;\r\n    align-content: space-evenly;\r\n}\r\n\r\n#ytmPlusCfg #ytmPlusCfg_header {\r\n    background: -webkit-linear-gradient(-45deg, rgb(170, 25, 25), rgb(25, 25, 170));\r\n    display: flex;\r\n    flex-direction: row;\r\n    flex-wrap: wrap;\r\n    justify-content: center;\r\n    background-clip: text;\r\n    -webkit-background-clip: text;\r\n    -webkit-text-fill-color: transparent;\r\n    width: 100%;\r\n}\r\n\r\n#ytmPlusCfg .config_header {\r\n    font-size: 1em;\r\n}\r\n\r\n#ytmPlusCfg .changeCategoryButton {\r\n    padding: 3.25%;\r\n    width: 95%;\r\n    height: auto;\r\n    white-space: pre-wrap;\r\n    animation: buttonBorder 2s infinite forwards linear;\r\n}\r\n\r\n.changeCategoryButton:disabled {\r\n    --borderColor1: #dd0055ee;\r\n    --borderColor2: #5500ddee;\r\n    animation: buttonBorder 2s infinite forwards linear;\r\n}\r\n\r\n.changeCategoryButton:hover {\r\n    --borderColor1: #ff0077ff;\r\n    --borderColor2: #7700ffff;\r\n    animation: buttonBorder 1s infinite forwards linear;\r\n}\r\n\r\n.changeCategoryButton:active {\r\n    --borderColor1: #6600eecc;\r\n    --borderColor2: #ee0066cc;\r\n    animation: buttonBorder 0.5s infinite forwards linear;\r\n}\r\n\r\n/* #ytmPlusCfg_buttons_holder {\r\n    text-align: center;\r\n}\r\n#ytmPlusCfg #ytmPlusCfg_saveBtn {\r\n    margin-right: 2%;\r\n}\r\n#ytmPlusCfg .saveclose_buttons {\r\n    margin: 0;\r\n    width: 49%;\r\n    padding: 1.5vh;\r\n    background: rgba(66, 66, 66, 0.8);\r\n    animation: buttonBorder 2s infinite forwards linear;\r\n}\r\n#ytmPlusCfg .saveclose_buttons:disabled {\r\n    --borderColor1: #dd0055ee;\r\n    --borderColor2: #5500ddee;\r\n    animation: buttonBorder 2s infinite forwards linear;\r\n}\r\n#ytmPlusCfg .saveclose_buttons:hover {\r\n    --borderColor1: #ff0077ff;\r\n    --borderColor2: #7700ffff;\r\n    animation: buttonBorder 1s infinite forwards linear;\r\n}\r\n#ytmPlusCfg .saveclose_buttons:active {\r\n    --borderColor1: #6600eecc;\r\n    --borderColor2: #ee0066cc;\r\n    animation: buttonBorder 0.5s infinite forwards linear;\r\n} */\r\n\r\n#ytmPlusCfg .reset_holder {\r\n    text-align: center;\r\n}\r\n\r\n#ytmPlusCfg .reset {\r\n    font-size: 1em;\r\n    color: rgba(255, 255, 255, 0.8);\r\n    cursor: pointer;\r\n    text-decoration: underline;\r\n}\r\n\r\n#divider {\r\n    background: #aaaaaa;\r\n    width: 0.1%;\r\n    height: 100%;\r\n}\r\n\r\n#currentSettings {\r\n    width: 60%;\r\n    height: 100%;\r\n    overflow: overlay;\r\n    justify-content: flex-start;\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n\r\n#ytmPlusCfg .section_header_holder {\r\n    margin-top: 0;\r\n    flex-direction: row;\r\n    flex-wrap: wrap;\r\n    align-content: flex-start;\r\n    justify-content: center;\r\n    width: 100%;\r\n}\r\n\r\n#ytmPlusCfg .config_var {\r\n    text-align: left;\r\n    height: auto;\r\n    width: 95%;\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    border-bottom: solid 1px #6666;\r\n    margin: 0;\r\n}\r\n\r\n#ytmPlusCfg .field_label {\r\n    font-size: 1.23em;\r\n    display: flex;\r\n    align-items: center;\r\n    margin-right: 0;\r\n    padding: 2% 0;\r\n}\r\n\r\n#ytmPlusCfg input[type="color"] {\r\n    color: #89befe;\r\n    background: #62666F;\r\n    display: flex;\r\n    align-items: center;\r\n    width: 20%;\r\n    height: 75%;\r\n    margin: 0;\r\n    padding: 0;\r\n    appearance: none;\r\n    -webkit-appearance: none;\r\n    border: none;\r\n    cursor: pointer;\r\n}\r\n\r\n#ytmPlusCfg input[type="color"]:before {\r\n    content: "CHANGE";\r\n    padding: 0 7.5%;\r\n}\r\n\r\n#ytmPlusCfg input[type="color"]::-webkit-color-swatch-wrapper {\r\n    padding: 0;\r\n}\r\n\r\n#ytmPlusCfg input[type="color"]::-webkit-color-swatch {\r\n    border: 0;\r\n}\r\n\r\n#ytmPlusCfg input[type="checkbox"] {\r\n    margin: 0;\r\n    padding: 0;\r\n    width: 20%;\r\n    height: 75%;\r\n    -webkit-appearance: none;\r\n    appearance: none;\r\n    background-color: #313338;\r\n    outline: none;\r\n    cursor: pointer;\r\n    transition: 0.3s;\r\n}\r\n\r\ninput[type="checkbox"]:before {\r\n    font-size: 1.5em;\r\n    content: "OFF";\r\n    width: 50%;\r\n    height: 100%;\r\n    border-radius: 8px;\r\n    font-size: 1em;\r\n    background: #62666F;\r\n    color: #313338;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    letter-spacing: 1px;\r\n    transition: 0.3s;\r\n}\r\n\r\ninput[type="checkbox"]:checked {\r\n    background: linear-gradient(135deg, #8175fe, #89befe);\r\n}\r\n\r\ninput[type="checkbox"]:checked:before {\r\n    content: "ON";\r\n    color: #89befe;\r\n    margin-left: 51%;\r\n}\r\n\r\n#ytmPlusCfg input[type="text"] {\r\n    width: 15%;\r\n    height: 75%;\r\n    padding: 0 2.5%;\r\n}\r\n\r\ninput {\r\n    background-color: rgba(66, 66, 66, 0.8);\r\n    border: none;\r\n    border-radius: 8px;\r\n    padding: 9px;\r\n    font-size: inherit;\r\n}\r\n\r\n#ytmPlusCfg textarea {\r\n    background-color: rgba(66, 66, 66, 0.8);\r\n    width: 100%;\r\n    height: 25%;\r\n    resize: none;\r\n    white-space: nowrap;\r\n    overflow-wrap: normal;\r\n    border: none;\r\n    border-radius: 8px;\r\n    padding: 1%;\r\n    scrollbar-width: none;\r\n    font-size: inherit;\r\n}\r\n\r\n#ytmPlusCfg textarea::-webkit-scrollbar {\r\n    display: none;\r\n    width: 0;\r\n    height: 0;\r\n}\r\n\r\n#ytmPlusCfg select {\r\n    background-color: rgba(66, 66, 66, 0.8);\r\n    border: none;\r\n    border-radius: 8px;\r\n    padding: 0;\r\n    font-size: inherit;\r\n    width: 20%;\r\n    height: 75%;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n#ytmPlusCfg *::-webkit-scrollbar {\r\n    width: 12px;\r\n}\r\n\r\n#ytmPlusCfg *::-webkit-scrollbar-track {\r\n    background: #313338;\r\n}\r\n\r\n#ytmPlusCfg *::-webkit-scrollbar-thumb {\r\n    background: #62666F;\r\n}\r\n\r\n#ytmPlusCfg *::-webkit-scrollbar-thumb:hover {\r\n    background: #b4bbbf;\r\n}\r\n\r\n#header_svg {\r\n    width: 100%;\r\n    height: 90px;\r\n}\r\n\r\n#vnumber_header {\r\n    -webkit-text-fill-color: white;\r\n}\r\n\r\nsvg text {\r\n    font-size: 5em;\r\n    animation: stroke 10s infinite alternate linear;\r\n    stroke-width: 2;\r\n    stroke: #aa0000;\r\n}\r\n\r\n@keyframes stroke {\r\n    0% {\r\n        fill: rgba(200, 0, 85, 0.25);\r\n        stroke: rgba(170, 0, 85, 1);\r\n        stroke-dashoffset: 25%;\r\n        stroke-dasharray: 10%;\r\n        stroke-width: 3;\r\n    }\r\n\r\n    100% {\r\n        fill: rgba(200, 0, 85, 0.25);\r\n        stroke: rgba(170, 0, 85, 1);\r\n        stroke-dashoffset: -25%;\r\n        stroke-dasharray: 10%;\r\n    }\r\n}\r\n\r\n:root {\r\n    --borderColor1: #66003366;\r\n    --borderColor2: #33006666;\r\n}\r\n\r\n@keyframes buttonBorder {\r\n    0% {\r\n        background-position: 0% center;\r\n    }\r\n\r\n    100% {\r\n        background-position: 200% center;\r\n    }\r\n}\r\n\r\n@-moz-document url-prefix() {\r\n    #currentSettings {\r\n        overflow: scroll;\r\n    }\r\n}\r\n\r\n#ytmPlusCfg .ytmPlusBorder {\r\n    border-radius: 10px;\r\n    border: solid 3px transparent;\r\n    box-shadow: 2px 1000px 1px #333 inset;\r\n    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(45deg, var(--borderColor2), var(--borderColor1), var(--borderColor2));\r\n    background-size: 200% 100%;\r\n    background-origin: border-box;\r\n    background-clip: content-box, border-box;\r\n}\r\n\r\n#ytmPlusCfg #reset_warning {\r\n    border: 3px solid;\r\n    border-radius: 8px;\r\n    background: #333138;\r\n    position: absolute;\r\n    inset: 25% 0 0 25%;\r\n    width: 50%;\r\n    height: 50%;\r\n    display: flex;\r\n    flex-direction: row;\r\n    flex-wrap: wrap;\r\n    justify-content: space-evenly;\r\n    align-content: space-around;\r\n    animation: buttonBorder 1s infinite forwards linear;\r\n}\r\n\r\n#warning_text {\r\n    font-size: 1.5em;\r\n    width: fit-content;\r\n    text-align: center;\r\n}\r\n\r\n.warning_buttons {\r\n    transition: 100ms linear;\r\n}\r\n\r\n#yes_reset_button {\r\n    background-color: #f77;\r\n}\r\n\r\n#yes_reset_button:hover {\r\n    background-color: #a00;\r\n}\r\n\r\n#no_goback_button {\r\n    background-color: #77f;\r\n}\r\n\r\n#no_goback_button:hover {\r\n    background-color: #00a;\r\n}';

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
            visualizerFft: { english: '<span title="High values can affect performance and can break circle visualizer.">Audio Samples⚠</span>', hungarian: '<span title="Magas értékek befolyásolhatják a teljesítményt és hibát okozhatnak a kör vizualizálóban.">Hang Minták⚠</span>' },
            visualizerEnergySaverType: { english: 'Energy Saver', hungarian: 'Energiatakarékos mód' },
            visualizerCircleEnabled: { english: 'Enable (Disabled on Navbar)', hungarian: 'Engedélyez (Navbaron Kikapcsolva)' },
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
            visualizerMinHertz: { english: 'Audiodata Min Hertz', hungarian: 'AudioData Min Hertz' },
            visualizerMaxHertz: { english: 'AudioData Max Hertz', hungarian: 'AudioData Max Hertz' },
            visualizerBassBounceMinHertz: { english: 'Bass Bounce Min Hertz', hungarian: 'Basszusugrálás Min Hertz' },
            visualizerBassBounceMaxHertz: { english: 'Bass Bounce Max Hertz', hungarian: 'Basszusugrálás Max Hertz' },
            visualizerBassBounceDebug: { english: 'Bass Bounce Debug Color', hungarian: 'Basszusugrálás Debug Szín' },
            visualizerEnergySaverFps: { english: 'Energy Saver FPS', hungarian: 'Energiatakarékos FPS' }
        };

        let langOption = GM_getValue('ytmPlusCfg', 'english');
        if(langOption != 'english') {
            langOption = JSON.parse(langOption).language;
            if(!langOption) langOption = 'english';
            else langOption = langOption.charAt(0).toLowerCase() + langOption.slice(1);
        }

        // 'type': 'color'; just results in a text input, they are later converted to actual color input, see open event
        const configFields = {
            language: {
                label: fieldTexts.lang[langOption],
                section: fieldTexts.langSection[langOption],
                type: 'select',
                options: ['English', 'Hungarian'],
                default: 'English'
            },
            neverAfk: {
                label: fieldTexts.noAfk[langOption],
                type: 'checkbox',
                default: true
            },
            noPromotions: {
                label: fieldTexts.noPromo[langOption],
                type: 'checkbox',
                default: true
            },
            skipDisliked: {
                label: fieldTexts.skipDisliked[langOption],
                type: 'checkbox',
                default: false
            },
            fixLayout: {
                label: fieldTexts.padding[langOption],
                type: 'checkbox',
                default: true
            },
            extraPlaybackButtons: {
                label: fieldTexts.extraButtons[langOption],
                type: 'checkbox',
                default: true
            },
            removeAlbumCover: {
                label: fieldTexts.removeThumbnail[langOption],
                type: 'checkbox',
                default: false
            },
            swapMainPanelWithPlaylist: {
                label: fieldTexts.swapMainPanelWithPlaylist[langOption],
                type: 'checkbox',
                default: false
            },
            changeBackground: {
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
            changeUpgradeButton: {
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
                default: '4096',
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
                default: 'https://imgur.com/HSTpR8R.png'
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
                default: 0.75
            },
            visualizerMinHertz: {
                label: fieldTexts.visualizerMinHertz[langOption],
                type: 'int',
                min: 0,
                max: 44100,
                default: 0
            },
            visualizerMaxHertz: {
                label: fieldTexts.visualizerMaxHertz[langOption],
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
            },
            lastOpenCategory: {
                section: 'backend',
                type: 'hidden',
                default: -1
            }
        };

        const elements = {
            player: undefined, // Has the sizes we need for album cover canvas
            playerPage: undefined,
            playerPageDiv: undefined, // Set to the player "overlay" in window.onload
            upgradeButton: undefined, // Set to the upgrade "button" in window.onload
            originalUpgradeText: undefined, // OGUpgrade text can differ based on YTM language
            navBarBg: undefined, // Holds the navbar bg's div, visualizer canvas is injected into its innerHTML
            mainPanel: undefined, // Holds something from around the album cover, - - | | - -
        };

        function changeBackground(turnOn, firstRun) {
            if(turnOn === false) {
                if(document.body.style.backgroundImage !== '') {
                    document.body.style.backgroundColor = '#000000';
                    document.body.style.backgroundImage = '';
                    elements.playerPageDiv.style.backgroundColor = '#000000';
                    elements.playerPageDiv.style.backgroundImage = '';
                }
                return;
            }
            try {
                if(firstRun === true) document.getElementsByTagName('ytmusic-browse-response')[0].children[0].remove();
                document.getElementsByClassName('immersive-background style-scope ytmusic-browse-response')[0].children[0].remove();
            }
            catch { }
            document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';
            const animation = ytmpConfig.get('bgGradientAnimation');
            animateBackground(document.body.style, true, animation);
            animateBackground(elements.playerPageDiv.style, false, animation);
        }

        function animateBackground(element, overflowOn, animation) {
            element.backgroundImage = `linear-gradient(${ytmpConfig.get('bgGradientAngle')}deg, ${ytmpConfig.get('bgColor')}, ${ytmpConfig.get('bgEnableGradient') == true ? ytmpConfig.get('bgGradient') : ytmpConfig.get('bgColor')})`;
            element.backgroundAttachment = 'fixed';

            if(animation !== 'Disabled') {
                element.backgroundSize = '200% 200%';
                element.animation = `backgroundGradient${animation} 5s linear infinite alternate`;
            }
            else {
                element.backgroundSize = '100% 100%';
                element.animation = '';
                element.backgroundPosition = 'center center';
            }

            if(overflowOn === false) element.overflow = 'hidden';
        }

        const functions = {
            clock: undefined, // Holds the interval function that updates the digital clock
            neverAfk: undefined, // Holds the anti-afk interval function
            noPromotions: undefined, // Holds the no promotions function
            skipDisliked: undefined, // Holds the skip disliked songs function
        };

        function changeUpgradeButton(mode) {
            let currentTime;
            clearInterval(functions.clockFunction);
            if(mode === 'Original') {
                elements.upgradeButton.textContent = elements.originalUpgradeText;
                elements.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
            }
            else if(mode === 'Digital Clock') {
                functions.clockFunction = setInterval(() => {
                    currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    elements.upgradeButton.textContent = currentTime;
                }, 1000);
                elements.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
            }
            else {
                elements.upgradeButton.textContent = '';
                elements.upgradeButton.parentElement.style.margin = '0px';
            }

            // Trust me this is the way
            const buttonStyle = elements.upgradeButton.style;
            if(mode === 'Digital Clock') {
                buttonStyle.background = `linear-gradient(${ytmpConfig.get('clockGradientAngle')}deg, ${ytmpConfig.get('clockColor')} 0%, ${ytmpConfig.get('clockGradient') === true ? ytmpConfig.get('clockGradientColor') : ytmpConfig.get('clockColor')} 50%, ${ytmpConfig.get('clockColor')} 100%)`;
                buttonStyle.backgroundSize = '200% 200%';
                buttonStyle.backgroundClip = 'text';
                buttonStyle.textFillColor = 'transparent';
                buttonStyle.webkitBackgroundClip = 'text';
                buttonStyle.webkitTextFillColor = 'transparent';
                buttonStyle.fontSize = '50px';
                const animation = ytmpConfig.get('clockGradientAnimation');
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

        function neverAfk(turnOn) { // Credit to q1k - https://greasyfork.org/en/users/1262-q1k
            clearInterval(functions.noAfkFunction);
            if(!turnOn) return;
            functions.noAfkFunction = setInterval(() => {
                document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 }));
                console.log('Nudged the page so user is not AFK.');
            }, 15000);
        }

        function noPromotions(turnOn) {
            clearInterval(functions.noPromotions);
            if(!turnOn) return;
            functions.noPromotions = setInterval(() => {
                const popup = document.getElementsByTagName('ytmusic-mealbar-promo-renderer');
                if(popup.length > 0) {
                    popup[0].remove();
                    console.log('Removed a promotion.');
                }
            }, 1000);
        }

        function skipDisliked(turnOn) {
            const titleHolder = document.getElementsByClassName('title style-scope ytmusic-player-bar')[0];
            titleHolder.removeEventListener('DOMSubtreeModified', checkDislike, false);
            if(!turnOn) return;
            titleHolder.addEventListener('DOMSubtreeModified', checkDislike, false);
        }

        // We skip after 5 seconds to let everything load and to not skip not disliked songs (huh?)
        function checkDislike() {
            if(elements.dumbFix === 0) return elements.dumbFix++;

            clearTimeout(functions.skipDislikedFunction);
            functions.skipDislikedFunction = setTimeout(() => {
                if(document.getElementById('like-button-renderer').children[0].ariaPressed == 'true') document.getElementsByClassName('next-button style-scope ytmusic-player-bar')[0].click();
            }, 5000);
            elements.dumbFix = 0;
        }

        function extraPlaybackButtons(turnOn) {
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
            if(turnOn) elements.playerPageDiv.style.paddingTop = '0px';
            else elements.playerPageDiv.style.padding = 'var(--ytmusic-player-page-vertical-padding) var(--ytmusic-player-page-horizontal-padding) 0';
        }

        function removeAlbumCover(turnOn) {
            elements.player.style.backgroundColor = '#00000001'; // minimal visibility required so shit doesn't break, don't ask
            const songImage = document.getElementById('song-image');
            const songMediaControls = elements.player.children[elements.player.children.length - 2];
            setTimeout(() => {
                if(!turnOn) {
                    songImage.style.opacity = 1;
                    songMediaControls.style.removeProperty('background');
                }
                else {
                    songImage.style.opacity = 0.001;
                    songMediaControls.style.background = '#0000';
                }
            }, 500);
        }

        async function swapMainPanelWithPlaylist(turnOn) {
            if(turnOn) {
                if(elements.mainPanel.parentNode.lastElementChild.id === elements.mainPanel.id) {
                    elements.mainPanel.parentNode.children[1].style.zIndex = 9999;
                    return;
                }
                await elements.mainPanel.parentNode.append(elements.mainPanel);
                elements.mainPanel.style.flexDirection = 'row-reverse';
                elements.mainPanel.parentNode.children[1].style.margin = '0 var(--ytmusic-player-page-content-gap) 0 0';
            }
            else {
                if(elements.mainPanel.parentNode.firstElementChild.id === elements.mainPanel.id) {
                    elements.mainPanel.parentNode.children[2].style.zIndex = 9999;
                    return;
                }
                await elements.mainPanel.parentNode.prepend(elements.mainPanel);
                elements.mainPanel.style.flexDirection = 'row';
                elements.mainPanel.parentNode.lastElementChild.style.margin = '0 0 0 var(--ytmusic-player-page-content-gap)';
            }
        }

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
                _frameMinTime: undefined
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
                _barEnd: undefined
            },
            canvases: {
                navbar: undefined,
                albumCover: undefined,
                background: undefined,
                playerBackground: undefined
            },
            values: {
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
            },
            audioContext: undefined,
            src: undefined,
            canvas: undefined,
            ctx: undefined,
            minHertz: undefined,
            maxHertz: undefined,
            removedBeginning: undefined,
            colorDivergence: undefined,
            analyser: undefined,
            bufferLength: undefined,
            audioData: undefined,
            resizeInterval: undefined
        };

        function injectElement(type, id, wrapperElm, customClass, customStyle, prepend) {
            const node = document.createElement(type);
            node.id = id;
            if(customClass) node.classList.add(customClass);
            if(customStyle) node.style = customStyle;
            if(!wrapperElm) {
                console.error('injectElement: Wrapper is undefined');
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
            if(visualizer.image.type === 'Custom') console.log('Custom Image URL is not an image');
            else {
                console.log('Visualizer Image couldn\'t be loaded.');
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
                console.log('thumbnailChildSrc is undefined');
                return;
            }

            if(currentURL.indexOf('data') === 0) {
                console.log('Current song has broken thumbnail, might be a video');

                if(lastSavedVideoURL !== currentVideoURL().href) lastSavedVideoURL = currentVideoURL().href;
                else if(loadSD === false && quality !== 'custom') {
                    console.log('Multiple changes with same URL, loadSD is false, quality is not custom');
                    return;
                }

                if(!lastSavedVideoURL) {
                    console.log('lastSavedVideoURL is empty, currentVideoURL.href is likely undefined');
                    return;
                }

                console.log(`Changed lastSavedVideoURL to: ${lastSavedVideoURL}`);
                imgLoaded = false;
                if(loadSD === true) {
                    quality = 'sddefault';
                    console.log(`loadSD is true, working with ${quality}`);
                }
                else quality = 'maxresdefault';
                currentURL = `https://i.ytimg.com/vi/${lastSavedVideoURL.split('v=')[1]}/${quality}.jpg`;
                loadSD = false;
            }
            else if(image.src === currentURL) {
                console.log('Image src is already thumbnail');
                return;
            }
            lastSavedVideoURL = currentVideoURL().href;
            finalize();
        }

        function customEvent() {
            if(currentURL === visualizer.image.customURL) {
                console.log('Custom Image change: URL is the same');
                return;
            }
            currentURL = visualizer.image.customURL;
            quality = 'custom';
            finalize();
        }

        function finalize() {
            console.log(`Changed currentURL to: ${currentURL}`);
            imgLoaded = false;
            image.src = currentURL;
        }

        function replaceImageURL() {
            if(visualizer.circleEnabled === false) return;
            if(visualizer.image.type === 'Thumbnail') thumbnailEvent();
            else if(visualizer.image.type === 'Custom') customEvent();
        }

        const PI2 = Math.PI * 2;
        function drawVisImage() {
            visualizer.ctx.save();
            visualizer.ctx.beginPath();
            visualizer.ctx.arc(visualizer.values.halfWidth, visualizer.values.halfHeight, visualizer.values.radius, 0, PI2, true);
            visualizer.ctx.closePath();
            visualizer.ctx.clip();

            let radiusMultX = visualizer.values.radius, radiusMultY = 1; // default visualizer.values for 1:1 aspect ratio

            if(quality === 'sddefault') { // enlarge image to cut off "cinematic bars"
                radiusMultX *= 1.33;
                radiusMultY = wRatio;
            }
            else if(hRatio > 1) { // vertical img handling
                radiusMultX *= hRatio;
                radiusMultY = wRatio;
            }
            else radiusMultY *= wRatio; // horizontal img handling

            visualizer.ctx.drawImage(
                image,
                visualizer.values.halfWidth - radiusMultX * radiusMultY,
                visualizer.values.halfHeight - radiusMultX,
                radiusMultX * 2 * radiusMultY,
                radiusMultX * 2
            );
            visualizer.ctx.restore();
        }

        function getFMT(fps) {
            visualizer.energySaver._frameMinTime = (1000 / 60) * (60 / fps) - (1000 / 60) * 0.5;
        }

        function calculateBassBounceBars() {
            visualizer.bassBounce._barStart = ~~(visualizer.bassBounce.minHertz / (44100 / visualizer.analyser.fftSize));
            visualizer.bassBounce._barEnd = ~~(visualizer.bassBounce.maxHertz / (44100 / visualizer.analyser.fftSize));
            if(visualizer.bassBounce._barEnd === 0) visualizer.bassBounce._barEnd++;
        }

        function getBufferData() {
            visualizer.analyser.fftSize = ytmpConfig.get('visualizerFft');
            visualizer.minHertz = ytmpConfig.get('visualizerMinHertz');
            visualizer.maxHertz = ytmpConfig.get('visualizerMaxHertz');
            visualizer.bufferLength = ~~((visualizer.maxHertz) / (44100 / visualizer.analyser.fftSize));
            visualizer.removedBeginning = visualizer.bufferLength - ~~((visualizer.maxHertz - visualizer.minHertz) / (44100 / visualizer.analyser.fftSize));
            visualizer.audioData = new Uint8Array(visualizer.bufferLength);
        }

        /**
     * Visualizer keys must have identical names with their GM_config equivalent, e.g.: visualizer.place = 'visualizerPlace'
     * Following this rule we can iterate through the visualizer object and automatically get all configs and their visualizer.values.
     * (bassBounce is the last thing it checks so any visualizer.values that should be initialised/changed upon saving should be set above bassBounce)
     */
        function initValues() {
            for(const key in visualizer) {
                let gmName;

                if(typeof visualizer[key] !== 'object') {
                    gmName = 'visualizer' + key[0].toUpperCase() + key.slice(1, key.length); // e.g.: visualizer + P + lace
                    visualizer[key] = ytmpConfig.get(gmName);
                    continue;
                }

                for(const key2 in visualizer[key]) {
                    if(key2[0] === '_') continue;
                    gmName = 'visualizer' +
               key[0].toUpperCase() + key.slice(1, key.length) + // B + assBounce
               key2[0].toUpperCase() + key2.slice(1, key2.length); // E + nabled

                    visualizer[key][key2] = ytmpConfig.get(gmName);
                }

                if(key !== 'bassBounce') continue;

                // Last things to do (everything here runs only once)
                if(visualizer.analyser !== undefined) {
                    visualizer.analyser.smoothingTimeConstant = ytmpConfig.get('visualizerSmoothing');
                    visualizer.analyser.minDecibels = ytmpConfig.get('visualizerMinDecibels');
                    visualizer.analyser.maxDecibels = ytmpConfig.get('visualizerMaxDecibels');
                    calculateBassBounceBars();
                }

                visualizer.colorDivergence = visualizer.bufferLength / visualizer.rgb.samples;
                if(visualizer.rgb.enabled === true && visualizer.rgb._data.length !== visualizer.rgb.samples) getRGB();

                if(visualizer.energySaver.type === 'Limit FPS' || visualizer.energySaver.type === 'Both') getFMT(visualizer.energySaver.fps);
                else getFMT(60);

                clearInterval(visualizer.resizeInterval);
                if(visualizer.place !== 'Disabled') visualizer.resizeInterval = setInterval(() => visualizerResizeFix(), 1000);
                return; // So we don't check anything beyond bassBounce
            }
        }

        // Pregenerates RGB colors so we don't have to calculate colors every frame
        function getRGB() {
            const hue = 2 * Math.PI / visualizer.rgb.samples,
                piD3 = Math.PI / 3, // Offset
                piD3x2 = 2 * Math.PI / 3; // so that colors aren't totally mixed together

            visualizer.rgb._data = [];
            for(let i = 0; i < visualizer.rgb.samples; i++) {
                visualizer.rgb._data[i] = {
                    red: Math.abs(visualizer.rgb.red * Math.sin(i * hue)),
                    green: Math.abs(visualizer.rgb.green * Math.sin(i * hue + piD3)),
                    blue: Math.abs(visualizer.rgb.blue * Math.sin(i * hue + piD3x2))
                };
            }
        }

        function visualizerResizeFix() {
            switch(visualizer.canvas.id) {
                case visualizer.canvases.navbar.id: {
                    if(visualizer.canvas.width !== elements.navBarBg.offsetWidth) visualizer.canvas.width = elements.navBarBg.offsetWidth;
                    if(visualizer.canvas.height !== elements.navBarBg.offsetHeight) visualizer.canvas.height = elements.navBarBg.offsetHeight;
                    break;
                }
                case visualizer.canvases.albumCover.id: {
                    if(visualizer.canvas.width !== elements.player.offsetWidth) visualizer.canvas.width = elements.player.offsetWidth;
                    if(visualizer.canvas.height !== elements.player.offsetHeight) visualizer.canvas.height = elements.player.offsetHeight;
                    break;
                }
                case visualizer.canvases.playerBackground.id: {
                    if(visualizer.canvas.width !== visualizer.canvases.playerBackground.offsetWidth) visualizer.canvas.width = visualizer.canvases.playerBackground.offsetWidth;
                    if(visualizer.canvas.height !== visualizer.canvases.playerBackground.offsetHeight) visualizer.canvas.height = visualizer.canvases.playerBackground.offsetHeight;
                    break;
                }
                case visualizer.canvases.background.id: {
                    if(visualizer.canvas.width !== visualizer.canvases.background.offsetWidth) visualizer.canvas.width = visualizer.canvases.background.offsetWidth;
                    if(visualizer.canvas.height !== visualizer.canvases.background.offsetHeight) visualizer.canvas.height = visualizer.canvases.background.offsetHeight;
                    break;
                }
            }

            visualizer.values.WIDTH = visualizer.canvas.width;
            visualizer.values.halfWidth = visualizer.values.WIDTH / 2;
            visualizer.values.HEIGHT = visualizer.canvas.height;
            visualizer.values.halfHeight = visualizer.values.HEIGHT / 2;

            // Fixes visualizer offset / Fixes album cover getting incosistent sizes if moved to different resolution displays
            elements.player.style.margin = 'auto 0px';

            if(visualizer.circleEnabled === true && visualizer.canvas.id !== visualizer.canvases.navbar.id) {
                if(visualizer.bassBounce.enabled === false) {
                    visualizer.values.radius = ~~(visualizer.values.HEIGHT / 4);
                    visualizer.values.heightModifier = (visualizer.values.HEIGHT - visualizer.values.radius) / 2 / 255;
                }
                else visualizer.values.heightModifier = (visualizer.values.HEIGHT - ~~(visualizer.values.HEIGHT / 8)) / 2 / 255;

                visualizer.values.barTotal = visualizer.values.circleSize * Math.PI / ((visualizer.bufferLength - visualizer.removedBeginning) - 2 + visualizer.values.circleSize);
                visualizer.values.barWidth = visualizer.values.barTotal * 0.45;
            }
            else {
                if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') visualizer.values.barTotal = visualizer.values.halfWidth / (visualizer.bufferLength - visualizer.removedBeginning);
                else visualizer.values.barTotal = visualizer.values.WIDTH / (visualizer.bufferLength - visualizer.removedBeginning);
                visualizer.values.barSpace = visualizer.values.barTotal * 0.05;
                visualizer.values.barWidth = visualizer.values.barTotal * 0.95;
            }
        }

        function averageOfArray(numbers) {
            let result = 0;
            for(let i = 0; i < numbers.length; i++) result += numbers[i];
            return result / numbers.length;
        }

        function getBarColor(i) {
            if(visualizer.rgb.enabled === true) {
            // Limits iteration for rgb._data, so we don't go out of bounds but also use every color available
                const color = ~~(i / visualizer.colorDivergence);

                if(visualizer.fade === true) visualizer.ctx.fillStyle = `rgba(${visualizer.rgb._data[color].red}, ${visualizer.rgb._data[color].green}, ${visualizer.rgb._data[color].blue}, ${visualizer.audioData[i] < 128 ? visualizer.audioData[i] * 2 / 255 : 1.0})`;
                else visualizer.ctx.fillStyle = `rgb(${visualizer.rgb._data[color].red}, ${visualizer.rgb._data[color].green}, ${visualizer.rgb._data[color].blue})`;
            }
            else if(visualizer.fade === true) visualizer.ctx.fillStyle = visualizer.color + (visualizer.audioData[i] < 128 ? (visualizer.audioData[i] * 2).toString(16) : 'FF');
            else visualizer.ctx.fillStyle = visualizer.color;

            if(visualizer.bassBounce.debug === true && i <= visualizer.bassBounce._barEnd && i >= visualizer.bassBounce._barStart) visualizer.ctx.fillStyle = '#FFF';
        }

        function visualizerCircle() { // Bitwise truncation (~~number) is used here instead of Math.floor() to squish out more performance.
            if(visualizer.startsFrom === 'Left' || visualizer.startsFrom === 'Right') visualizer.visualizer.values.circleSize = 2; // 2(pi) = full
            else visualizer.values.circleSize = 1; // 1(pi) = half;

            if(visualizer.bassBounce.enabled === true || visualizer.rotate === 'Reactive (Bass)') calculateBass();

            getRotationValue();

            if(visualizer.image.type !== 'Disabled' && imgLoaded === true) drawVisImage();

            visualizer.values.reactiveBarHeightMultiplier = 0.3 + visualizer.values.bassSmoothRadius / 512; // 0.3 . . 0.55

            if(visualizer.startsFrom === 'Right') drawArcs(false);
            else if(visualizer.startsFrom === 'Left') drawArcs(true);
            else if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') {
                drawArcs(false);
                drawArcs(true);
            }
        }

        function calculateBass() {
            visualizer.values.bass = visualizer.audioData.slice(
                visualizer.bassBounce._barStart,
                visualizer.bassBounce._barEnd
            );

            if(visualizer.bassBounce.smooth === true) visualizer.values.bassSmoothRadius = ~~((visualizer.values.bassSmoothRadius + (averageOfArray(visualizer.values.bass) / 2)) / 2);
            else visualizer.values.bassSmoothRadius = ~~(averageOfArray(visualizer.values.bass) / 2);

            if(visualizer.bassBounce.enabled === true) visualizer.values.radius = ~~(visualizer.values.HEIGHT / 8) + visualizer.values.bassSmoothRadius * visualizer.values.heightModifier * 1.25;
        }

        function getRotationValue() {
            const direction = (visualizer.rotateDirection === 'Clockwise') ? 1 : -1;

            switch(visualizer.rotate) {
                case 'Disabled': default: { visualizer.values.rotationValue = 0; } break;
                case 'On': { visualizer.values.rotationValue += 0.005 * direction; } break;
                case 'Reactive': { visualizer.values.rotationValue += (Math.pow(averageOfArray(visualizer.audioData) / 10000 + 1, 2) - 1) * direction; } break;
                case 'Reactive (Bass)': { visualizer.values.rotationValue += (Math.pow(visualizer.values.bassSmoothRadius / 10000 + 1, 2) - 1) * direction; } break;
            }
        }

        function drawArcs(backwards) {
            visualizer.ctx.save();
            visualizer.ctx.translate(visualizer.values.halfWidth, visualizer.values.halfHeight); // move to center of circle
            visualizer.ctx.rotate(visualizer.values.startingPoint + (visualizer.values.barTotal / 2 + visualizer.values.rotationValue)); // Set bar starting point to top + rotation

            for(let i = visualizer.removedBeginning; i < visualizer.bufferLength; ++i) {
            // if(visualizer.values.circleSize === 1 && backwards === true && (i === 0 || i === visualizer.bufferLength - 1)) {
            //     visualizer.ctx.rotate(-visualizer.values.barTotal);
            //     continue;
            // }

                getBarColor(i);

                if(visualizer.bassBounce.enabled === true) visualizer.values.barHeight = visualizer.audioData[i] * visualizer.values.heightModifier * visualizer.values.reactiveBarHeightMultiplier;
                else visualizer.values.barHeight = visualizer.audioData[i] * visualizer.values.heightModifier * 0.5;

                if(visualizer.move === 'Outside' || visualizer.move === 'Both Sides') visualizer.values.outerRadius = visualizer.values.radius + visualizer.values.barHeight;
                else visualizer.values.outerRadius = visualizer.values.radius;

                if(visualizer.move === 'Inside' || visualizer.move === 'Both Sides') visualizer.values.innerRadius = visualizer.values.radius - visualizer.values.barHeight;
                else visualizer.values.innerRadius = visualizer.values.radius;

                if(visualizer.values.outerRadius < 0) visualizer.values.outerRadius = 0;
                if(visualizer.values.innerRadius < 0) visualizer.values.innerRadius = 0;

                visualizer.ctx.beginPath();
                visualizer.ctx.arc(0, 0, visualizer.values.innerRadius, -visualizer.values.barWidth, visualizer.values.barWidth);
                visualizer.ctx.arc(0, 0, visualizer.values.outerRadius, visualizer.values.barWidth, -visualizer.values.barWidth, true);
                visualizer.ctx.fill();
                if(backwards === true) visualizer.ctx.rotate(-visualizer.values.barTotal); // rotate the coordinates by one bar
                else visualizer.ctx.rotate(visualizer.values.barTotal);
            }
            visualizer.ctx.restore();
        }

        function visualizerNavbar() {
            if(visualizer.startsFrom === 'Center') visualizer.values.xPosOffset = visualizer.values.barWidth + visualizer.values.barSpace / 2; // Centers 1 bar
            else if(visualizer.startsFrom === 'Edges') visualizer.values.xPosOffset = visualizer.values.barSpace / 2; // Both sides are offset a bit for perfect centering
            else visualizer.values.xPosOffset = 0;

            const maxBarHeight = (visualizer.values.HEIGHT / 255);

            firstDraw(maxBarHeight);

            if(visualizer.startsFrom === 'Center') {
                visualizer.values.xPosOffset = visualizer.values.halfWidth + visualizer.values.barSpace / 2; // Reset pos to center
                secondDraw(maxBarHeight);
            }
            else if(visualizer.startsFrom === 'Edges') {
                visualizer.values.xPosOffset = visualizer.values.barWidth + (visualizer.values.barSpace / 2); // Reset pos to right + offset for perfect center
                secondDraw(maxBarHeight);
            }
        }

        function firstDraw(maxBarHeight) {
            for(let i = visualizer.removedBeginning; i < visualizer.bufferLength; i++) {
                visualizer.values.barHeight = visualizer.audioData[i] * maxBarHeight;

                getBarColor(i);

                // To this day I don't get the Y and visualizer.values.HEIGHT visualizer.values
                if(visualizer.startsFrom === 'Left') {
                    visualizer.ctx.fillRect( // Draws rect from left to right
                        visualizer.values.xPosOffset,
                        visualizer.values.HEIGHT - visualizer.values.barHeight,
                        visualizer.values.barWidth,
                        visualizer.values.barHeight
                    );
                }
                else if(visualizer.startsFrom === 'Center') {
                    if(visualizer.values.halfWidth - visualizer.values.xPosOffset < 0 - visualizer.values.barWidth) break;
                    visualizer.ctx.fillRect( // Draws rect from left to right, starting from center to left
                        visualizer.values.halfWidth - visualizer.values.xPosOffset,
                        visualizer.values.HEIGHT - visualizer.values.barHeight,
                        visualizer.values.barWidth,
                        visualizer.values.barHeight
                    );
                }
                else if(visualizer.startsFrom === 'Right') {
                    visualizer.ctx.fillRect( // Draws rect from right to left
                        visualizer.values.WIDTH - visualizer.values.xPosOffset,
                        visualizer.values.HEIGHT - visualizer.values.barHeight,
                        0 - visualizer.values.barWidth,
                        visualizer.values.barHeight
                    );
                }
                else if(visualizer.startsFrom === 'Edges') {
                    if(visualizer.values.xPosOffset > visualizer.values.halfWidth) break;
                    visualizer.ctx.fillRect( // Draws rect from left to right, from left to center
                        visualizer.values.xPosOffset,
                        visualizer.values.HEIGHT - visualizer.values.barHeight,
                        visualizer.values.barWidth,
                        visualizer.values.barHeight
                    );
                }
                visualizer.values.xPosOffset += visualizer.values.barTotal;
            }
        }

        function secondDraw(maxBarHeight) {
            for(let i = visualizer.removedBeginning; i < visualizer.bufferLength; i++) {
                visualizer.values.barHeight = visualizer.audioData[i] * maxBarHeight;

                getBarColor(i);

                if(visualizer.startsFrom === 'Center') {
                    if(visualizer.values.xPosOffset > visualizer.values.WIDTH) break;
                    visualizer.ctx.fillRect( // Draws rect from left to right, from center to right
                        visualizer.values.xPosOffset,
                        visualizer.values.HEIGHT - visualizer.values.barHeight,
                        visualizer.values.barWidth,
                        visualizer.values.barHeight
                    );
                }
                else if(visualizer.startsFrom === 'Edges') {
                    if(visualizer.values.xPosOffset > visualizer.values.halfWidth) break;
                    visualizer.ctx.fillRect( // Draws rect from left to right, from right to center
                        visualizer.values.WIDTH - visualizer.values.xPosOffset,
                        visualizer.values.HEIGHT - visualizer.values.barHeight,
                        visualizer.values.barWidth,
                        visualizer.values.barHeight
                    );
                }
                visualizer.values.xPosOffset += visualizer.values.barTotal;
            }
        }

        async function setupVisualizer() {
        // Injecting visualizer visualizer.canvases
            visualizer.canvases.navbar = await injectElement('canvas', 'visualizerNavbarCanvas', elements.navBarBg, null, 'position: absolute; left: 0; top: 0; width: inherit; height: inherit; pointer-events: none;');
            visualizer.canvases.albumCover = await injectElement('canvas', 'visualizerAlbumCoverCanvas', elements.player, null, 'position: absolute; z-index: 9999; pointer-events: none; visibility: visible; width: inherit; height: inherit;', true);
            elements.navBarBg.style.opacity = 1;

            // 64px is navbar, 72px is bottom player controls
            visualizer.canvases.background = await injectElement('canvas', 'visualizerBackgroundCanvas', document.getElementById('content'), null, 'position: fixed; pointer-events: none; visibility: visible; width: 100%; height: calc(100vh - (64px + 72px)); margin-top: 64px;', true);
            visualizer.canvases.playerBackground = await injectElement('canvas', 'visualizerPlayerBackgroundCanvas', document.getElementById('player-page'), null, 'position: absolute; pointer-events: none; visibility: visible; width: inherit; height: inherit;', true);
            getVideo();
        }

        let video;
        function getVideo() {
            video = document.querySelector('video');
            if(video) startVisualizer();
            else {
                console.warn('Query "video" not found, retrying in 100ms.');
                setTimeout(getVideo, 100);
            }
        }

        function startVisualizer() {
        // Init, connecting yt audio to visualizer.canvas
            if(visualizer.audioContext === undefined) {
                visualizer.audioContext = new AudioContext();
                visualizer.src = visualizer.audioContext.createMediaElementSource(video);
                visualizer.analyser = visualizer.audioContext.createAnalyser();
            }

            switch(visualizer.place) {
                case 'Navbar': default: visualizer.canvas = visualizer.canvases.navbar; break;
                case 'Album Cover': visualizer.canvas = visualizer.canvases.albumCover; break;
                case 'Background': visualizer.canvas = visualizer.canvases.playerBackground; break;
            }
            visualizer.ctx = visualizer.canvas.getContext('2d');

            visualizer.src.connect(visualizer.analyser);
            visualizer.analyser.connect(visualizer.audioContext.destination);

            getBufferData();
            initValues();

            window.removeEventListener('resize', visualizerResizeFix);
            window.addEventListener('resize', visualizerResizeFix);

            replaceImageURL();
            requestAnimationFrame(renderFrame);
        }

        let lastFrameTime = 0;

        // NEVER REMOVE TIME VAR FROM HERE
        function renderFrame(time) {
        // Don't do anything if True Pause energy saver is on and playback is paused
            if((visualizer.energySaver.type === 'True Pause' || visualizer.energySaver.type === 'Both') && video.paused === true) return requestAnimationFrame(renderFrame);

            // If render would be faster than max fps (60 by default if energy saver is off) come back later
            if(time - lastFrameTime < visualizer.energySaver._frameMinTime) return requestAnimationFrame(renderFrame);
            lastFrameTime = time;

            visualizer.ctx.clearRect(0, 0, visualizer.values.WIDTH, visualizer.values.HEIGHT);

            // Kill everything if disabled, can be turned back with requestAnimationFrame(renderFrame), see 1's save event
            if(visualizer.place === 'Disabled') return;

            // Get audio data
            visualizer.analyser.getByteFrequencyData(visualizer.audioData);

            // Color cycle effect
            if(visualizer.rgb.enabled === true) {
                visualizer.rgb._data.push(visualizer.rgb._data[0]);
                visualizer.rgb._data.shift();
            }

            if(visualizer.place === 'Navbar') {
            // If visualizer place was changed to X but it's not yet X, change to X
                if(visualizer.canvas.id !== visualizer.canvases.navbar.id) {
                    visualizer.canvas = visualizer.canvases.navbar;
                    visualizer.ctx = visualizer.canvas.getContext('2d');
                }
                visualizerNavbar(visualizer.ctx);
            }
            else if(visualizer.place === 'Album Cover') {
                if(visualizer.canvas.id !== visualizer.canvases.albumCover.id) {
                    visualizer.canvas = visualizer.canvases.albumCover;
                    visualizer.ctx = visualizer.canvas.getContext('2d');
                }
                if(visualizer.circleEnabled === true) visualizerCircle(visualizer.ctx);
                else visualizerNavbar(visualizer.ctx);
            }
            else if(visualizer.place === 'Background') {
            // if miniplayer == true
                if(elements.player.playerPageOpen_ === false) {
                    if(visualizer.canvas.id !== visualizer.canvases.background.id) {
                        visualizer.canvas = visualizer.canvases.background;
                        visualizer.ctx = visualizer.canvas.getContext('2d');
                        console.log('Switched visualizer.canvas to background');
                    }
                }
                else if(visualizer.canvas.id !== visualizer.canvases.playerBackground.id) {
                    visualizer.canvas = visualizer.canvases.playerBackground;
                    visualizer.ctx = visualizer.canvas.getContext('2d');
                    console.log('Switched visualizer.canvas to playerBackground');
                }
                if(visualizer.circleEnabled === true) visualizerCircle(visualizer.ctx);
                else visualizerNavbar(visualizer.ctx);
            }

            requestAnimationFrame(renderFrame);
        }

        async function createResetWarning(frame, resetLink) {
        // Creating window that pops up if you press reset
            const resetWarning = await injectElement('div', 'reset_warning', frame, null, 'display: none');
            const warningText = await injectElement('span', 'warning_text', resetWarning);
            warningText.innerHTML = 'WAIT!<br>RESET EVERYTHING TO DEFAULT?';
            const yesResetButton = await injectElement('input', 'yes_reset_button', resetWarning, 'warning_buttons');
            yesResetButton.type = 'button';
            yesResetButton.value = 'Yes, reset';
            yesResetButton.addEventListener('click', () => {
                ytmpConfig.reset();
                ytmpConfig.save();
                resetWarning.style.display = 'none';
            });
            const noGoBackButton = await injectElement('input', 'no_goback_button', resetWarning, 'warning_buttons');
            noGoBackButton.type = 'button';
            noGoBackButton.value = 'No, go back';
            noGoBackButton.addEventListener('click', () => {
                resetWarning.style.display = 'none';
            });

            resetLink.addEventListener('click', () => {
                resetWarning.style.display = 'flex';
            });
        }

        async function sortOutCategories(wrapper) {
            const sideBySide = injectElement('div', 'sideBySide', wrapper);
            const categorySelect = injectElement('div', 'categorySelect', sideBySide);

            // Get all categories and make category names into buttons
            const categories = document.getElementsByClassName('section_header_holder');
            for(let i = 0, len = categories.length - 1; i < len; i++) categorySelect.innerHTML += `<input type="button" class="changeCategoryButton ytmPlusBorder" value="${categories[i].children[0].innerHTML}">`;

            // Set click events to each category button
            const changeCategoryButton = document.getElementsByClassName('changeCategoryButton');
            let lastOpenSetting;
            for(let i = 0; i < changeCategoryButton.length; i++) {
                changeCategoryButton[i].addEventListener('click', () => {
                    for(let j = 0; j < changeCategoryButton.length; j++) changeCategoryButton[j].disabled = false; // Enable all buttons
                    changeCategoryButton[i].disabled = true; // "Disable" current button (for styling)
                    const currentSetting = document.getElementById('ytmPlusCfg_section_' + i); // Find matching category settings
                    if(lastOpenSetting) lastOpenSetting.style.display = 'none'; // Make previously opened category disappear
                    currentSetting.style.display = 'flex'; // Make selected category appear
                    ytmpConfig.set('lastOpenCategory', i); // Set self as last open
                    lastOpenSetting = currentSetting;
                });
            }

            injectElement('div', 'divider', sideBySide);

            const currentSettings = injectElement('div', 'currentSettings', sideBySide);
            categorySelect.prepend(wrapper.childNodes[0]); // Put header (title) into categorySelect
            categorySelect.append(wrapper.childNodes[wrapper.childNodes.length - 2]); // Put save/close buttons into categorySelect
            categorySelect.lastElementChild.style.display = 'none'; // V3: remove save and close buttons, everything auto saves, close button is now X in top right

            const resetDiv = document.getElementsByClassName('reset_holder block')[0];
            categorySelect.append(resetDiv); // Put reset button into categorySelect
            resetDiv.innerHTML = '';
            // Recreate a element, easiest way to remove default listener without changing gm_config
            const resetLink = await injectElement('a', 'ytmPlusCfg_resetLink', resetDiv, 'reset');
            resetLink.innerHTML = 'Reset to defaults';

            for(let i = 0, len = wrapper.childNodes.length - 1; i < len; i++) { // - 1: skip sideBySide div i think
                const configVars = wrapper.childNodes[0];
                configVars.style = 'display: none;'; // Set category to invisible
                configVars.removeChild(configVars.firstElementChild); // Remove category name
                currentSettings.appendChild(configVars); // Move category to currentSettings and wait to be visible
            }
            if(ytmpConfig.get('lastOpenCategory') !== -1) changeCategoryButton[ytmpConfig.get('lastOpenCategory')].click();

            return resetLink;
        }

        async function createTitlebar(wrapper, frame) {
        // Creating titlebar
            const titlebar = await injectElement('div', 'ytmPlusCfg_titlebar', wrapper, null, null, true);
            const closeButton = await injectElement('input', 'titlebar_x', titlebar);
            closeButton.type = 'button';
            closeButton.value = 'X';
            closeButton.addEventListener('click', () => {
                ytmpConfig.close();
            });

            // Support button
            const kofi = injectElement('div', 'supportMePls', titlebar);
            const kofiA = injectElement('a', 'goToKofi', kofi);
            kofiA.innerHTML = '<img src="https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/61e111774d3a2f67c827cd25_Frame%205.png">';
            kofiA.href = 'https://ko-fi.com/realmariod';
            kofiA.title = 'Buy me a Coffee!';
            kofiA.target = '_blank';

            // Adding draggable part to titlebar now so that you can actually click X and support
            const draggablePart = await injectElement('div', 'titlebar_draggable', titlebar);
            const titlebarIcon = await injectElement('img', 'titlebar_icon', draggablePart);
            titlebarIcon.src = 'https://i.imgur.com/gfg6VLJ.png';
            const titlebarTitle = await injectElement('span', 'titlebar_title', draggablePart);
            // eslint-disable-next-line no-undef
            titlebarTitle.innerHTML = `ytmPlus ${vNumber}`;
            dragElement(draggablePart, frame);
        }

        function dragElement(elmnt, frame) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            elmnt.addEventListener('mousedown', dragMouseDown);

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.addEventListener('mouseup', closeDragElement);
                // call a function whenever the cursor moves:
                document.addEventListener('mousemove', elementDrag);
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = (pos3 - e.clientX);
                pos2 = (pos4 - e.clientY);
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                frame.style.top = (frame.offsetTop - pos2) + 'px';
                frame.style.left = (frame.offsetLeft - pos1) + 'px';
            }

            function closeDragElement() {
            // stop moving when mouse button is released:
                document.removeEventListener('mouseup', closeDragElement);
                document.removeEventListener('mousemove', elementDrag);
            }
        }

        async function manageUI(frame) {
            frame.style.overflow = 'hidden';
            frame.style.aspectRatio = '4 / 3';
            frame.style.removeProperty('width');
            frame.style.removeProperty('height');
            frame.style.removeProperty('max-width');
            frame.style.removeProperty('max-height');
            frame.style.inset = '44px 0px 0px 440px';

            const wrapper = document.getElementById('ytmPlusCfg_wrapper');

            const resetLink = await sortOutCategories(wrapper);

            createTitlebar(wrapper, frame);

            createResetWarning(frame, resetLink);
        }

        const headerSVG = '<svg id="header_svg">\r\n    <g style="overflow:hidden; text-anchor: middle;">\r\n        <defs>\r\n            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">\r\n                <feGaussianBlur stdDeviation="5" result="glow"/>\r\n                <feMerge>\r\n                <feMergeNode in="glow"/>\r\n                <feMergeNode in="glow"/>\r\n                <feMergeNode in="glow"/>\r\n                </feMerge>\r\n            </filter>\r\n        </defs>\r\n        <text x="50%" y="50%" dy=".35em" text-anchor="middle">YTMPlus</text>\r\n        <a href="https://github.com/RealMarioD/ytmplus" target="_blank"><text style="filter: url(#glow);" x="50%" y="50%" dy=".35em" text-anchor="middle">YTMPlus</text></a>\r\n    </g>\r\n</svg>';

        function openEvent(doc, win, frame) { // open function is mostly customizing settings UI
        // Every color input we want has to be 'manually set' (ytmpConfig's customType would come in handy but how the hell do it work)
            const colorTypeFields = [
                'bgColor',
                'bgGradient',
                'clockColor',
                'clockGradientColor',
                'visualizerColor'
            ];
            for(let i = 0; i < colorTypeFields.length; i++) doc.getElementById('ytmPlusCfg_field_' + colorTypeFields[i]).type = 'color';

            manageUI(frame);

            // Live change for input tags + Adding info to int/float settings
            const inputs = doc.getElementsByTagName('input');
            for(let i = 0; i < inputs.length; i++) {
                inputs[i].addEventListener('change', () => ytmpConfig.save());
                if(!isNaN(parseInt(inputs[i].value, 10))) {
                    const fieldSettings = ytmpConfig.fields[inputs[i].id.split('_')[2]].settings;
                    inputs[i].title = `type: ${fieldSettings.type} | default: ${fieldSettings.default} | ${fieldSettings.min} . . ${fieldSettings.max}`;
                }
            }
            // Live change for select tags
            const selects = doc.getElementsByTagName('select');
            for(let i = 0; i < selects.length; i++) selects[i].addEventListener('change', () => ytmpConfig.save());

            // Live change for textarea tags + 1 row height
            const textareas = doc.getElementsByTagName('textarea');
            for(let i = 0; i < textareas.length; i++) {
                textareas[i].parentElement.style.alignItems = 'stretch';
                textareas[i].previousSibling.style.padding = 0;
                textareas[i].addEventListener('change', () => ytmpConfig.save());
            }

            // Header title svg
            const title = doc.getElementById('ytmPlusCfg_header');
            title.innerHTML = headerSVG;
            const vnumberHeader = injectElement('span', 'vnumber_header', title);
            // eslint-disable-next-line no-undef
            vnumberHeader.innerHTML = vNumber; // vNumber hacked in with metadataBuilder

            doc.addEventListener('keydown', event => {
                if(event.key == 'Escape') ytmpConfig.close();
            });
        }

        function saveEvent() {
        // Updates updateable stuff on save
            changeBackground(ytmpConfig.get('changeBackground'));

            changeUpgradeButton(ytmpConfig.get('changeUpgradeButton'));

            neverAfk(ytmpConfig.get('neverAfk'));

            noPromotions(ytmpConfig.get('noPromotions'));

            skipDisliked(ytmpConfig.get('skipDisliked'));

            extraPlaybackButtons(ytmpConfig.get('extraPlaybackButtons'));

            fixLayout(ytmpConfig.get('fixLayout'));

            removeAlbumCover(ytmpConfig.get('removeAlbumCover'));

            swapMainPanelWithPlaylist(ytmpConfig.get('swapMainPanelWithPlaylist'));

            startVisualizer();

            window.dispatchEvent(new Event('resize'));
        }

        const ytmpConfig = new GM_configStruct({
            id: 'ytmPlusCfg',
            title: 'ytmPlus',
            fields: configFields,
            css: settingsMenu,
            events: {
                open: openEvent,
                save: saveEvent
            },
            frame: injectElement('div', 'ytmPlusCfg', document.body, null, 'display: flex')
        });

        function keydownEvent(ev) {
            if(ev.code !== 'Backslash' || ev.ctrlKey === false) return;

            if(ytmpConfig.isOpen === false) ytmpConfig.open();
            else ytmpConfig.close();

            console.log(ytmpConfig);
        }

        function injectStyle(css) {
            const node = document.createElement('style');
            const textNode = document.createTextNode(css);
            node.appendChild(textNode);
            document.head.appendChild(node);
        }

        const keyframes = '@keyframes backgroundGradientHorizontal {\r\n    0% {\r\n        background-position: 0% center;\r\n    }\r\n\r\n    100% {\r\n        background-position: 100% center;\r\n    }\r\n}\r\n@keyframes backgroundGradientVertical {\r\n    0% {\r\n        background-position: center 0%;\r\n    }\r\n\r\n    100% {\r\n        background-position: center 100%;\r\n    }\r\n}\r\n@keyframes clockGradientHorizontal {\r\n    from {\r\n        background-position: 0% center;\r\n    }\r\n    to {\r\n        background-position: 200% center;\r\n    }\r\n}\r\n@keyframes clockGradientVertical {\r\n    from {\r\n        background-position: center 0%;\r\n    }\r\n    to {\r\n        background-position: center 200%;\r\n    }\r\n}';

        const cogFrame = '#cogRotator {\r\n    position: absolute;\r\n    width: 36px;\r\n    height: 36px;\r\n    left: 100px;\r\n    opacity: 1;\r\n    transform: rotate(0);\r\n    filter: drop-shadow(0px 0px 0px #ff00ff);\r\n    transition: 0.15s ease-in-out;\r\n}\r\n\r\n#cogRotator:hover {\r\n    transform: rotate(90deg);\r\n    filter: drop-shadow(0px 0px 8px #ff00ff);\r\n}';

        async function createCogFrame() {
            const ytmSettingsSvg = document.getElementById('settings').outerHTML; // Steal YT settings icon

            const settingsSVG =
        `<svg id="settingsSVGButton" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="display: block; width: 100%; height: 100%; fill: white;">
        ${ytmSettingsSvg}
    </svg>`;

            let cogHolder = document.getElementsByTagName('ytmusic-nav-bar')[0];
            if(!cogHolder) cogHolder = document.body;


            injectStyle(cogFrame);
            const cogRotator = injectElement('div', 'cogRotator', cogHolder);
            cogRotator.innerHTML = settingsSVG;

            const settingsSVGButton = document.getElementById('settingsSVGButton');

            settingsSVGButton.addEventListener('click', () => {
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

        async function setup() {
            elements.player = await document.getElementById('player');
            elements.playerPage = await document.getElementById('player-page');
            elements.playerPageDiv = elements.playerPage.firstElementChild;
            elements.navBarBg = await document.getElementById('nav-bar-background');
            elements.mainPanel = await document.getElementById('main-panel');

            // Injecting animations for background and clock gradients
            injectStyle(keyframes);

            // Running each function
            neverAfk(ytmpConfig.get('neverAfk'));

            noPromotions(ytmpConfig.get('noPromotions'));

            skipDisliked(ytmpConfig.get('skipDisliked'));

            fixLayout(ytmpConfig.get('fixLayout'));

            extraPlaybackButtons(ytmpConfig.get('extraPlaybackButtons'));

            changeBackground(ytmpConfig.get('changeBackground'), true);

            // These functions are timed out so needed elements can load
            setTimeout(async () => {
                removeAlbumCover(ytmpConfig.get('removeAlbumCover'));

                swapMainPanelWithPlaylist(ytmpConfig.get('swapMainPanelWithPlaylist'));

                elements.upgradeButton = await document.getElementsByClassName('tab-title style-scope ytmusic-pivot-bar-item-renderer')[3];
                elements.originalUpgradeText = elements.upgradeButton.textContent;
                changeUpgradeButton(ytmpConfig.get('changeUpgradeButton'));
            }, 500);

            setupVisualizer();

            // Adds a settings button on the navbar
            createCogFrame();
        }

        window.addEventListener('keydown', (e) => keydownEvent(e));

        window.addEventListener('load', () => setup());
    })();
}
catch (err) {
    console.error(err);
}
