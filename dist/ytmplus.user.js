// ==UserScript==
// @name         ytmPlus
// @version      3.0.0-gamma.1
// @author       mario_d
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
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==
const vNumber = 'v3.0.0-gamma.1';
try {
    (function() {
        'use strict';

        const settingsMenu = '/* Width calculations based on 4:3 aspect ratio */\r\n/* Small screen */\r\n@media screen and (min-height: 0px) {\r\n    #ytmPlusCfg {\r\n        height: 512px;\r\n        font-size: 12px;\r\n    }\r\n}\r\n\r\n/* Medium screen */\r\n@media screen and (min-height: 768px) and (min-width: 1024px){\r\n    #ytmPlusCfg {\r\n        height: 768px;\r\n        font-size: 18px;\r\n    }\r\n}\r\n\r\n/* Large screen */\r\n@media screen and (min-height: 1080px) and (min-width: 1440px) {\r\n    #ytmPlusCfg {\r\n        height: 1080px;\r\n        font-size: 24px;\r\n    }\r\n}\r\n\r\n#ytmPlusCfg {\r\n    background-color: rgba(0, 0, 0, 0.925);\r\n    box-shadow: 20px 20px 40px rgba(10, 10, 10, 0.8);\r\n    border: 0;\r\n    border-radius: 1em;\r\n    z-index: 9000;\r\n    /* GM_config sets a lot of things to element, we can only change it in JS no? */\r\n}\r\n\r\n#ytmPlusCfg * {\r\n    font-family: monospace;\r\n    color: #EEEEEE;\r\n}\r\n\r\n#ytmPlusCfg_wrapper {\r\n    display: flex;\r\n    height: inherit;\r\n    flex-direction: row;\r\n    flex-wrap: wrap;\r\n    align-content: flex-start;\r\n    justify-content: space-evenly;\r\n}\r\n\r\n#ytmPlusCfg_titlebar {\r\n    display: flex;\r\n    flex-direction: row-reverse;\r\n    background-color: rgb(66, 66, 66, 0.925);\r\n    width: 100%;\r\n    height: 6%;\r\n    align-items: center;\r\n}\r\n\r\n.titlebarButtons {\r\n    font-size: 1.25em;\r\n    padding: 0;\r\n    height: 100%;\r\n    aspect-ratio: 1;\r\n    border-radius: 0;\r\n    border-left: 1px solid rgba(0, 0, 0, 0.925);\r\n    background-color: rgb(66, 66, 66, 0.925);\r\n    transition: 100ms linear;\r\n}\r\n\r\n.titlebarButtons:hover {\r\n    background-color: #a1a1a1;\r\n}\r\n\r\n#titlebar_x:hover {\r\n    background-color: rgb(170, 25, 25);\r\n}\r\n\r\n#supportMePls:hover {\r\n    background: #00CAFE;\r\n}\r\n\r\n#goToKofi {\r\n    height: 100%;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n#supportMePls img {\r\n    height: 100%;\r\n}\r\n\r\n#titlebar_draggable {\r\n    width: 100%;\r\n    height: 100%;\r\n    cursor: move;\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: center;\r\n}\r\n\r\n#titlebar_icon {\r\n    height: 80%;\r\n    margin: 0 0.675%;\r\n}\r\n\r\n#sideBySide {\r\n    display: flex;\r\n    flex-direction: column;\r\n    flex-wrap: wrap;\r\n    width: 100%;\r\n    height: 94%;\r\n    align-content: space-evenly;\r\n}\r\n\r\n#categorySelect {\r\n    width: 40%;\r\n    justify-content: space-evenly;\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 100%;\r\n    flex-wrap: wrap;\r\n    align-content: space-evenly;\r\n}\r\n\r\n#ytmPlusCfg #ytmPlusCfg_header { /* Old UI logo */\r\n    background: -webkit-linear-gradient(-45deg, rgb(170, 25, 25), rgb(25, 25, 170));\r\n    display: flex;\r\n    flex-direction: row;\r\n    flex-wrap: wrap;\r\n    justify-content: center;\r\n    background-clip: text;\r\n    -webkit-background-clip: text;\r\n    -webkit-text-fill-color: transparent;\r\n    width: 100%;\r\n}\r\n\r\n#ytmPlusCfg .config_header {\r\n    font-size: 1em;\r\n}\r\n\r\n#ytmPlusCfg .changeCategoryButton {\r\n    background-image: linear-gradient(90deg, rgb(50, 25 ,170), rgb(170, 25, 50));\r\n    background-size: 200% 100%;\r\n    background-position: 0% 0%;\r\n    border: 0;\r\n    border-radius: 0.75em;\r\n    box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;\r\n    width: 95%;\r\n    padding: 3.25%;\r\n    white-space: nowrap;\r\n    cursor: pointer;\r\n    transition: 200ms linear;\r\n}\r\n\r\n#ytmPlusCfg .changeCategoryButton:hover {\r\n    background-position: 50% 0%;\r\n}\r\n\r\n#ytmPlusCfg .changeCategoryButton:disabled {\r\n    background-position: 100% 0%;\r\n}\r\n\r\n#ytmPlusCfg .reset_holder {\r\n    text-align: center;\r\n}\r\n\r\n#ytmPlusCfg .reset {\r\n    font-size: 1em;\r\n    color: rgba(255, 255, 255, 0.8);\r\n    cursor: pointer;\r\n    text-decoration: underline;\r\n}\r\n\r\n#ytmpDivider {\r\n    background: #aaaaaa;\r\n    width: 0.1%;\r\n    height: 100%;\r\n}\r\n\r\n#currentSettings {\r\n    width: 60%;\r\n    height: 100%;\r\n    overflow-y: scroll;\r\n    justify-content: flex-start;\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n\r\n#ytmPlusCfg .section_header_holder {\r\n    margin-top: 0;\r\n    flex-direction: row;\r\n    flex-wrap: wrap;\r\n    align-content: flex-start;\r\n    justify-content: center;\r\n    width: 100%;\r\n}\r\n\r\n#ytmPlusCfg .config_var {\r\n    text-align: left;\r\n    height: auto;\r\n    width: 95%;\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    border-bottom: solid 1px #6666;\r\n    margin: 0;\r\n}\r\n\r\n#ytmPlusCfg .field_label {\r\n    width: 70%;\r\n    font-size: 1.23em;\r\n    display: flex;\r\n    align-items: center;\r\n    margin-right: 0;\r\n    padding: 2% 0;\r\n}\r\n\r\n#ytmPlusCfg input[type="color"] {\r\n    color: #89befe;\r\n    background: #62666F;\r\n    display: flex;\r\n    align-items: center;\r\n    width: 10%;\r\n    height: 1.5em;\r\n    margin: 0;\r\n    padding: 0;\r\n    appearance: none;\r\n    -webkit-appearance: none;\r\n    border: none;\r\n    cursor: pointer;\r\n}\r\n\r\n/* #ytmPlusCfg input[type="color"]:before {\r\n    content: "CHANGE";\r\n    padding: 0 7.5%;\r\n} */\r\n\r\n#ytmPlusCfg input[type="color"]::-webkit-color-swatch-wrapper {\r\n    padding: 0;\r\n}\r\n\r\n#ytmPlusCfg input[type="color"]::-webkit-color-swatch {\r\n    /* border: 1px solid #fff; */\r\n    border-radius: 0.75em\r\n}\r\n\r\n#ytmPlusCfg input[type="checkbox"] {\r\n    display: flex;\r\n    align-items: center;\r\n    margin: 0;\r\n    padding: 0;\r\n    width: 10%;\r\n    height: 1.5em;\r\n    -webkit-appearance: none;\r\n    appearance: none;\r\n    background-color: #313338;\r\n    outline: none;\r\n    cursor: pointer;\r\n    transition: 0.3s;\r\n}\r\n\r\ninput[type="checkbox"]:before {\r\n    font-size: 1em;\r\n    content: "";\r\n    width: 1.5em;\r\n    height: 1.5em;\r\n    border-radius: 0.75em;\r\n    background: #62666F;\r\n    color: #313338;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    letter-spacing: 1px;\r\n    transition: 0.3s;\r\n}\r\n\r\ninput[type="checkbox"]:checked {\r\n    background: linear-gradient(135deg, #4135be, #497ebe);\r\n}\r\n\r\ninput[type="checkbox"]:checked:before {\r\n    content: "";\r\n    background: linear-gradient(135deg, #8276ff, #8abfff);\r\n    color: #89befe;\r\n    margin-left: auto;\r\n}\r\n\r\ninput[type="checkbox"]:hover {\r\n    background: linear-gradient(135deg, #313338, #52565F);\r\n}\r\n\r\ninput[type="checkbox"]:checked:hover {\r\n    background: linear-gradient(135deg, #5145ae, #598ece);\r\n}\r\n\r\n#ytmPlusCfg input[type="text"] {\r\n    width: 15%;\r\n    height: 75%;\r\n    padding: 0 2.5%;\r\n}\r\n\r\ninput {\r\n    background-color: rgba(66, 66, 66, 0.8);\r\n    border: none;\r\n    border-radius: 0.75em;\r\n    padding: 9px;\r\n    font-size: inherit;\r\n}\r\n\r\n#ytmPlusCfg textarea {\r\n    background-color: rgba(66, 66, 66, 0.8);\r\n    width: 100%;\r\n    height: 25%;\r\n    resize: none;\r\n    white-space: nowrap;\r\n    overflow-wrap: normal;\r\n    border: none;\r\n    border-radius: 0.75em;\r\n    padding: 1%;\r\n    scrollbar-width: none;\r\n    font-size: inherit;\r\n}\r\n\r\n#ytmPlusCfg textarea::-webkit-scrollbar {\r\n    display: none;\r\n    width: 0;\r\n    height: 0;\r\n}\r\n\r\n#ytmPlusCfg select {\r\n    background: #030303ee;\r\n    border: 0;\r\n    border-bottom: 1px solid;\r\n    border-radius: 0;\r\n    padding: 0;\r\n    font-size: inherit;\r\n    width: 30%;\r\n    height: 75%;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n#ytmPlusCfg select:hover {\r\n    background: #303030ee;\r\n}\r\n\r\n#ytmPlusCfg *::-webkit-scrollbar {\r\n    width: 0.7em;\r\n}\r\n\r\n#ytmPlusCfg *::-webkit-scrollbar-track {\r\n    background: #313338;\r\n}\r\n\r\n#ytmPlusCfg *::-webkit-scrollbar-thumb {\r\n    background: #62666F;\r\n}\r\n\r\n#ytmPlusCfg *::-webkit-scrollbar-thumb:hover {\r\n    background: #b4bbbf;\r\n}\r\n\r\n#header_svg {\r\n    width: 100%;\r\n    height: 90px;\r\n}\r\n\r\n#vnumber_header {\r\n    -webkit-text-fill-color: white;\r\n}\r\n\r\nsvg text {\r\n    font-size: 5em;\r\n    animation: stroke 10s infinite alternate linear;\r\n    stroke-width: 2;\r\n    stroke: #aa0000;\r\n}\r\n\r\n@keyframes stroke {\r\n    0% {\r\n        fill: rgba(200, 0, 85, 0.25);\r\n        stroke: rgba(170, 0, 85, 1);\r\n        stroke-dashoffset: 25%;\r\n        stroke-dasharray: 10%;\r\n        stroke-width: 3;\r\n    }\r\n\r\n    100% {\r\n        fill: rgba(200, 0, 85, 0.25);\r\n        stroke: rgba(170, 0, 85, 1);\r\n        stroke-dashoffset: -25%;\r\n        stroke-dasharray: 10%;\r\n    }\r\n}\r\n\r\n@keyframes buttonBorder {\r\n    0% {\r\n        background-position: 0% center;\r\n    }\r\n\r\n    100% {\r\n        background-position: 200% center;\r\n    }\r\n}\r\n\r\n@-moz-document url-prefix() {\r\n    #currentSettings {\r\n        overflow: scroll;\r\n    }\r\n}\r\n\r\n#ytmPlusCfg #reset_warning {\r\n    border: 3px solid;\r\n    border-radius: 0.75em;\r\n    background: #333138;\r\n    position: absolute;\r\n    inset: 25% 0 0 25%;\r\n    width: 50%;\r\n    height: 50%;\r\n    display: flex;\r\n    flex-direction: row;\r\n    flex-wrap: wrap;\r\n    justify-content: space-evenly;\r\n    align-content: space-around;\r\n}\r\n\r\n#warning_text {\r\n    font-size: 1.5em;\r\n    width: fit-content;\r\n    text-align: center;\r\n}\r\n\r\n.warning_buttons {\r\n    transition: 100ms linear;\r\n}\r\n\r\n#yes_reset_button {\r\n    background-color: #f77;\r\n}\r\n\r\n#yes_reset_button:hover {\r\n    background-color: #a00;\r\n}\r\n\r\n#no_goback_button {\r\n    background-color: #77f;\r\n}\r\n\r\n#no_goback_button:hover {\r\n    background-color: #00a;\r\n}\r\n\r\n#shortcutWindow {\r\n    z-index: 9999;\r\n    inset: 0;\r\n    position: absolute;\r\n    width: 100%;\r\n    height: 100vh;\r\n    background-color: #00000088;\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n    font-size: 48px;\r\n    color: white;\r\n}\r\n\r\n#shortcutText {\r\n    display: flex;\r\n    align-items: center;\r\n    text-align: center;\r\n    height: 15%;\r\n}\r\n\r\n#shortcutButtonHolder {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-evenly;\r\n    width: 8em;\r\n}\r\n\r\n/** don\'t be bamboozled, this is not the button in the settings menu, but the input that stores the shortcut */\r\n#shortcutButtonHolder input {\r\n    width: 4em;\r\n    color: white;\r\n    font-size: 0.5em;\r\n    transition: 100ms linear;\r\n}\r\n\r\n#saveShortcut {\r\n    background-color: #77f;\r\n}\r\n\r\n#saveShortcut:hover {\r\n    background-color: #00a;\r\n}\r\n\r\n#resetShortcut, #quitShortcut {\r\n    background-color: #f77;\r\n}\r\n\r\n#resetShortcut:hover, #quitShortcut:hover {\r\n    background-color: #a00;\r\n}\r\n\r\n.userButtons {\r\n    width: 30%;\r\n    height: 2.5em;\r\n    background-color: #77f;\r\n    transition: 100ms linear;\r\n}\r\n\r\n.userButtons:hover {\r\n    background-color: #00a;\r\n}';

        function injectElement(type, id, wrapperElm, customClass, customStyle, prepend) {
            const node = document.createElement(type);
            if(id) node.id = id;
            if(typeof customClass === 'object') {
                customClass.forEach(c => {
                    node.classList.add(c);
                });
            }
            else if(customClass) node.classList.add(customClass);
            if(customStyle) node.style = customStyle;
            if(!wrapperElm) {
                console.error('injectElement: Wrapper is undefined');
                return;
            }
            if(prepend) wrapperElm.prepend(node);
            else wrapperElm.append(node);
            return node;
        }

        const fieldTexts = {
            refreshTitle: { english: 'Refresh for changes', hungarian: 'Frissíts a változásokhoz' },
            utilities: { english: 'Utilities', hungarian: 'Hasznosságok' },
            ytmpSettings: { english: 'ytmPlus Settings', hungarian: 'ytmPlus Beállítások' },
            changeShortcut: { english: 'Current shortcut:', hungarian: 'Jelenlegi gyorsbillentyű:' },
            language: { english: 'Language', hungarian: 'Nyelv',
                options: { english: ['English', 'Magyar'] }
            },
            changeWindowSize: { english: 'Window Size', hungarian: 'Ablak Méret',
                options: { english: ['Auto', 'Small', 'Medium', 'Large'], hungarian: ['Auto', 'Kicsi', 'Közepes', 'Nagy'] }
            },
            neverAfk: { english: 'Never AFK', hungarian: 'Sosem AFK' },
            noPromotions: { english: 'No Promotions', hungarian: 'Promóciók kikapcsolása' },
            skipDisliked: { english: 'Skip Disliked Songs', hungarian: 'Nem kedvelt dalok kihagyása' },
            fixLayout: { english: 'Fix Layout', hungarian: 'Elrendezés javítása' },
            unlockWidth: { english: 'Unlock Width',
                options: { english: ['Disabled', 'Album Cover', 'Playlist', 'Both'], hungarian: ['Kikapcsolva', 'Album Borító', 'Lejátszási Lista', 'Mindkettő'] },
                title: { english: 'Changes mostly visible above 1080p resolution', hungarian: 'Változtatások leginkább 1080p felbontás felett láthatóak' }
            },
            extraPlaybackButtons: { english: 'Extra Playback Buttons', hungarian: 'Több Irányító Gomb' },
            videoSongSwitcher: { english: 'Video/Song Switcher', hungarian: 'Videó/Zene Váltó' },
            removeAlbumCover: { english: 'Remove Album Cover', hungarian: 'Album Borító Eltávolítása' },
            swapMainPanelWithPlaylist: { english: 'Swap Album Cover with Playlist', hungarian: 'Album Borító és Lejátszási Lista felcserélése' },
            themeSection: { english: 'Theme Settings', hungarian: 'Téma beállítások' },
            navbarBackgroundChange: { english: 'Change Navbar Background', hungarian: 'Navbar Háttér megváltoztatása' },
            navbarBackgroundColor: { english: 'Color', hungarian: 'Szín' },
            navbarBackgroundGradientEnabled: { english: 'Enable Gradient', hungarian: 'Színátmenet Engedélyezése' },
            navbarBackgroundGradientColor: { english: 'Gradient Color', hungarian: 'Átmenet Színe' },
            navbarBackgroundGradientAngle: { english: 'Gradient Angle', hungarian: 'Átmenet Irány' },
            navbarBackgroundGradientAnimation: { english: 'Gradient Animation', hungarian: 'Átmenet Animáció',
                options: { english: ['Disabled', 'Horizontal', 'Vertical'], hungarian: ['Kikapcsolva', 'Vízszintes', 'Függőleges'] }
            },
            siteBackgroundChange: { english: 'Change Site Background', hungarian: 'Oldal Háttér megváltoztatása' },
            changeBackgroundSection: { english: 'Background Settings', hungarian: 'Háttér Beállítások' },
            siteBackgroundColor: { english: 'Color', hungarian: 'Szín' },
            siteBackgroundGradientEnabled: { english: 'Enable Gradient', hungarian: 'Színátmenet engedélyezése' },
            siteBackgroundGradientColor: { english: 'Gradient Color', hungarian: 'Átmenet Színe' },
            siteBackgroundGradientAngle: { english: 'Gradient Angle', hungarian: 'Átmenet Irány' },
            siteBackgroundGradientAnimation: { english: 'Gradient Animation', hungarian: 'Átmenet Animáció',
                options: { english: ['Disabled', 'Horizontal', 'Vertical'], hungarian: ['Kikapcsolva', 'Vízszintes', 'Függőleges'] }
            },
            // changeUpgradeButton: { english: 'Change "Upgrade" Button', hungarian: '"Bővítés" Gomb Cserélése' },
            removeUpgradeButton: { english: 'Remove Upgrade Button', hungarian: 'Bővítés Gomb Eltávolítása' },
            // clockSection: { english: 'Upgrade Button', hungarian: 'Bővítés Gomb' },
            clockColor: { english: 'Clock Color', hungarian: 'Óra Színe' },
            clockGradient: { english: 'Enable Gradient', hungarian: 'Színátmenet Engedélyezése' },
            clockGradientColor: { english: 'Gradient Color', hungarian: 'Színátmenet' },
            clockGradientAngle: { english: 'Gradient Angle', hungarian: 'Színátmenet Irány' },
            clockGradientAnimation: { english: 'Gradient Animation', hungarian: 'Színtámenet Animáció' },
            visualizerPlace: { english: 'Visualizer Place', hungarian: 'Vizualizáló Helye',
                options: { english: ['Disabled', 'Navbar', 'Album Cover', 'Background'], hungarian: ['Kikapcsolva', 'Navbar', 'Album Borító', 'Háttér'] }
            },
            visualizerPlaceSection: { english: 'Music Visualizer', hungarian: 'Zene Vizualizáló' },
            visualizerStartsFrom: { english: 'Bars are placed from:', hungarian: 'Sávok elhelyezése innen:',
                options: { english: ['Left', 'Center', 'Right', 'Edges'], hungarian: ['Bal', 'Közép', 'Jobb', 'Szélek'] },
            },
            visualizerColor: { english: 'Visualizer Color', hungarian: 'Vizualizáló Színe' },
            visualizerRgbEnabled: { english: 'RGB Mode', hungarian: 'RGB Mód' },
            visualizerFade: { english: 'Enable Bar Fade', hungarian: 'Sávok Áttűnésének Engedélyezése' },
            visualizerFft: { english: 'Audio Samples', hungarian: 'Hang Minták',
                options: { english: ['32', '64', '128', '256', '512', '1024', '2048', '4096', '8192', '16384'] },
                title: { english: 'High values can affect performance.', hungarian: 'Magas értékek befolyásolhatják a teljesítményt.' }
            },
            visualizerEnergySaverType: { english: 'Energy Saver', hungarian: 'Energiatakarékos mód',
                options: { english: ['Disabled', 'Limit FPS', 'Pause Everything', 'Both'], hungarian: ['Kikapcsolva', 'FPS Limiter', 'Mindent Megállít', 'Mindkettő'] }
            },
            visualizerCircleEnabled: { english: 'Circle Visualizer', hungarian: 'Kör Vizualizáló' },
            visualizerShakeEnabled: { english: 'Shake Effect' },
            visualizerRotate: { english: 'Rotation', hungarian: 'Forgás',
                options: { english: ['Disabled', 'Enabled', 'Reactive', 'Reactive (Bass)'], hungarian: ['Kikapcsolva', 'Engedélyezve', 'Reaktív', 'Reaktív (Basszus)'] }
            },
            visualizerRotateDirection: { english: 'Rotation Direction', hungarian: 'Forgásirány',
                options: { english: ['Clockwise', 'Counter Clockwise'], hungarian: ['Óramutató Járásával', 'Óramutató Járásával Ellentétesen'] }
            },
            visualizerMove: { english: 'Bars Movement Direction', hungarian: 'Sávok Mozgásiránya',
                options: { english: ['Inside', 'Outside', 'Both'], hungarian: ['Befelé', 'Kifelé', 'Mindkettő'] }
            },
            visualizerBassBounceEnabled: { english: 'Bass Bounce', hungarian: 'Basszusugrálás' },
            visualizerBassBounceCalculation: { english: 'Bass Threshold Calculation', hungarian: 'Basszus Küszöb Számítás',
                options: { english: ['Average', 'Median'], hungarian: ['Átlag', 'Medián'] }
            },
            visualizerBassBounceSmooth: { english: 'Smooth Bounce', hungarian: 'Ugrálás Simítása' },
            visualizerBassBounceFallSmoothing: { english: 'Bass Bounce Fall Smoothing', hungarian: 'Basszusugrálás Simítása (esésnél)' },
            visualizerBassBounceGrowSmoothing: { english: 'Bass Bounce Grow Smoothing', hungarian: 'Basszusugrálás Simítása (növekedésnél)' },
            visualizerImageType: { english: 'Visualizer Image', hungarian: 'Vizualizáló Kép',
                options: { english: ['Disabled', 'Thumbnail', 'Custom URL'], hungarian: ['Kikapcsolva', 'Borítókép', 'Egyéni URL'] }
            },
            visualizerImageCustomURL: { english: 'Custom Image URL', hungarian: 'Egyéni Kép URL' },
            attention1: { english: 'Changes here can cause glitches!', hungarian: 'Az itteni változtatások hibákat okozhatnak!' },
            attention1Section: { english: 'Advanced Visualizer Settings', hungarian: 'Speciális Vizualizáló Beállítások' },
            visualizerRgbRed: { english: 'RGB:Red', hungarian: 'RGB:Piros' },
            visualizerRgbGreen: { english: 'RGB:Green', hungarian: 'RGB:Zöld' },
            visualizerRgbBlue: { english: 'RGB:Blue', hungarian: 'RGB:Kék' },
            visualizerRgbSamples: { english: 'RGB:Samples', hungarian: 'RGB:Minták' },
            visualizerMinDecibels: { english: 'Min Decibels' },
            visualizerMaxDecibels: { english: 'Max Decibels' },
            visualizerSmoothing: { english: 'Smoothing', hungarian: 'Simítás' },
            visualizerMinHertz: { english: 'AudioData Min Hertz' },
            visualizerMaxHertz: { english: 'AudioData Max Hertz' },
            visualizerBassBounceThreshold: { english: 'Bass Bounce Threshold' },
            visualizerBassBounceMinHertz: { english: 'Bass Bounce Min Hertz', hungarian: 'Basszusugrálás Min Hertz' },
            visualizerBassBounceMaxHertz: { english: 'Bass Bounce Max Hertz', hungarian: 'Basszusugrálás Max Hertz' },
            visualizerBassBounceDebug: { english: 'Bass Bounce Debug Color', hungarian: 'Basszusugrálás Debug Szín' },
            visualizerBassBounceMinRadius: { english: 'Bass Bounce Min Radius', hungarian: 'Basszusugrálás Min Sugár' },
            visualizerBassBounceMaxRadius: { english: 'Bass Bounce Max Radius', hungarian: 'Basszusugrálás Max Sugár' },
            visualizerEnergySaverFps: { english: 'Energy Saver FPS', hungarian: 'Energiatakarékos FPS' },
            visualizerRenderScale: { english: 'Render Scale' },
            visualizerShakeThreshold: { english: 'Shake Threshold' },
            visualizerShakeMultiplier: { english: 'Shake Multiplier' },
            backendSection: { english: 'You are not supposed to see this.' },
            lastOpenCategory: { english: 'You are not supposed to see this.' },
            shortcut: { english: 'You are not supposed to see this.' },
            windowSize: { english: 'Surely' }
        };

        function fixupFields() {
        // When we first call this function, ytmpConfig is not initalized yet, so we can't use ytmpConfig.get('language'), yadi yadi yada
        // also circular dependecies are apparently a bad thing...
            let langOption = 'english';
            const rawSaveData = GM_getValue('ytmPlusCfg', undefined);
            if(rawSaveData !== undefined) {
                const parsedSaveData = JSON.parse(rawSaveData);
                if(parsedSaveData !== undefined && parsedSaveData.language !== undefined) langOption = parsedSaveData.language.toLowerCase();
            }

            for(const field in configFields) {
                if(fieldTexts[field] === undefined) {
                    console.warn(`"${field}" is undefined in fieldTexts! Only do this for hidden fields! (still might be a bad idea ithink not sure)`);
                    continue;
                }

                if(configFields[field].type === 'customSelect') {
                    if(configFields[field].rawOptions !== undefined) {
                        if(fieldTexts[field].options === undefined) throw new Error(`"${field}" is missing options in fieldTexts!`);
                        configFields[field].options = fieldTexts[field].options[langOption] || fieldTexts[field].options['english'];
                        configFields[field].value = configFields[field].options[configFields[field].rawOptions.indexOf(configFields[field].default)];
                    }
                    else throw new Error(`"${field}" is missing rawOptions!`);
                }

                if(configFields[field].label === undefined) {
                    const newLabel = { label: fieldTexts[field][langOption] || fieldTexts[field]['english'] };
                    // We use assign() so label is the first property, if label is not the first property, label/input order will be messed up
                    configFields[field] = Object.assign(newLabel, configFields[field]);
                }
                else configFields[field].label = fieldTexts[field][langOption] || fieldTexts[field]['english'];

                if(configFields[field].refresh === true) {
                    configFields[field].label += '↻';
                    configFields[field].title = fieldTexts.refreshTitle[langOption] || fieldTexts.refreshTitle['english'];
                }

                if(configFields[field].setTitle === true) {
                    configFields[field].label += '<span style="font-weight: 100;">⚠</span>';
                    if(configFields[field].refresh === true) configFields[field].title += ' | ' + fieldTexts[field].title[langOption] || fieldTexts[field].title['english'];
                    else configFields[field].title = fieldTexts[field].title[langOption] || fieldTexts[field].title['english'];
                }

                if(configFields[field].section !== undefined) configFields[field].section = configFields[field].section[langOption] || configFields[field].section['english'];
            }
            return configFields;
        }

        // type: 'color' just results in a text input, they are later converted to actual color input, see open event
        const configFields = {
            changeShortcut: {
                section: fieldTexts.ytmpSettings,
                type: 'customButton',
                valueStorage: 'shortcut'
            },
            language: {
                refresh: true,
                type: 'customSelect',
                rawOptions: ['english', 'hungarian'],
                default: 'english'
            },
            changeWindowSize: {
                type: 'customSelect',
                rawOptions: ['auto', 'small', 'medium', 'large'],
                default: 'auto'
            },
            neverAfk: {
                section: fieldTexts.utilities,
                type: 'checkbox',
                default: true
            },
            noPromotions: {
                type: 'checkbox',
                default: true
            },
            skipDisliked: {
                type: 'checkbox',
                default: false
            },
            fixLayout: {
                type: 'checkbox',
                default: true
            },
            unlockWidth: {
                type: 'customSelect',
                rawOptions: ['Disabled', 'Album Cover', 'Playlist', 'Both'],
                default: 'Album Cover',
                setTitle: true
            },
            extraPlaybackButtons: {
                type: 'checkbox',
                default: true
            },
            videoSongSwitcher: {
                type: 'checkbox',
                default: true
            },
            removeAlbumCover: {
                type: 'checkbox',
                default: false
            },
            swapMainPanelWithPlaylist: {
                type: 'checkbox',
                default: false
            },
            navbarBackgroundChange: {
                section: fieldTexts.themeSection,
                type: 'checkbox',
                default: false
            },
            navbarBackgroundColor: {
                type: 'color',
                default: '#aa0000',
                subCheckbox: 'navbarBackgroundChange'
            },
            navbarBackgroundGradientEnabled: {
                type: 'checkbox',
                default: true,
                subCheckbox: 'navbarBackgroundChange'
            },
            navbarBackgroundGradientColor: {
                type: 'color',
                default: '#0000aa',
                subCheckbox: 'navbarBackgroundChange'
            },
            navbarBackgroundGradientAngle: {
                type: 'int',
                min: -360,
                max: 360,
                default: 45,
                subCheckbox: 'navbarBackgroundChange'
            },
            navbarBackgroundGradientAnimation: {
                type: 'customSelect',
                rawOptions: ['Disabled', 'Horizontal', 'Vertical'],
                default: 'Horizontal',
                subCheckbox: 'navbarBackgroundChange'
            },
            siteBackgroundChange: {
                type: 'checkbox',
                default: true
            },
            siteBackgroundColor: {
                type: 'color',
                default: '#AA0000',
                subCheckbox: 'siteBackgroundChange'
            },
            siteBackgroundGradientEnabled: {
                type: 'checkbox',
                default: true,
                subCheckbox: 'siteBackgroundChange'
            },
            siteBackgroundGradientColor: {
                type: 'color',
                default: '#0000AA',
                subCheckbox: 'siteBackgroundChange'
            },
            siteBackgroundGradientAngle: {
                type: 'int',
                min: -360,
                max: 360,
                default: 45,
                subCheckbox: 'siteBackgroundChange'
            },
            siteBackgroundGradientAnimation: {
                type: 'customSelect',
                rawOptions: ['Disabled', 'Horizontal', 'Vertical'],
                default: 'Horizontal',
                subCheckbox: 'siteBackgroundChange'
            },
            // changeUpgradeButton: {
            //     type: 'customSelect',
            //     rawOptions: ['Original', 'Remove Button', 'Digital Clock'],
            //     default: 'Digital Clock'
            // },
            removeUpgradeButton: {
                type: 'checkbox',
                default: false
            },
            // clockColor: {
            //     type: 'color',
            //     default: '#AA3333',
            //     subOption: 'changeUpgradeButton.2'
            // },
            // clockGradient: {
            //     type: 'checkbox',
            //     default: true,
            //     subOption: 'changeUpgradeButton.2'
            // },
            // clockGradientColor: {
            //     type: 'color',
            //     default: '#3333AA',
            //     subOption: 'changeUpgradeButton.2'
            // },
            // clockGradientAngle: {
            //     type: 'int',
            //     min: -360,
            //     max: 360,
            //     default: 90,
            //     subOption: 'changeUpgradeButton.2'
            // },
            // clockGradientAnimation: {
            //     type: 'customSelect',
            //     rawOptions: ['Disabled', 'Horizontal', 'Vertical'],
            //     default: 'Horizontal',
            //     subOption: 'changeUpgradeButton.2'
            // },
            visualizerPlace: {
                section: fieldTexts.visualizerPlaceSection,
                type: 'customSelect',
                rawOptions: ['Disabled', 'Navbar', 'Album Cover', 'Background'],
                default: 'Album Cover'
            },
            visualizerStartsFrom: {
                type: 'customSelect',
                rawOptions: ['Left', 'Center', 'Right', 'Edges'],
                default: 'Edges'
            },
            visualizerColor: {
                type: 'color',
                default: '#C800C8'
            },
            visualizerRgbEnabled: {
                type: 'checkbox',
                default: true
            },
            visualizerFade: {
                type: 'checkbox',
                default: true
            },
            visualizerFft: {
                type: 'customSelect',
                rawOptions: ['32', '64', '128', '256', '512', '1024', '2048', '4096', '8192', '16384'],
                default: '8192',
                setTitle: true
            },
            visualizerEnergySaverType: {
                type: 'customSelect',
                rawOptions: ['Disabled', 'Limit FPS', 'True Pause', 'Both'],
                default: 'Disabled'
            },
            visualizerCircleEnabled: {
                type: 'checkbox',
                default: true,
            },
            visualizerRotate: {
                type: 'customSelect',
                rawOptions: ['Disabled', 'On', 'Reactive', 'Reactive (Bass)'],
                default: 'Reactive (Bass)',
                subCheckbox: 'visualizerCircleEnabled'
            },
            visualizerRotateDirection: {
                type: 'customSelect',
                rawOptions: ['Clockwise', 'Counter-Clockwise'],
                default: 'Counter-Clockwise',
                subCheckbox: 'visualizerCircleEnabled'
            },
            visualizerMove: {
                type: 'customSelect',
                rawOptions: ['Inside', 'Outside', 'Both Sides'],
                default: 'Outside',
                subCheckbox: 'visualizerCircleEnabled'
            },
            visualizerShakeEnabled: {
                type: 'checkbox',
                default: true,
                subCheckbox: 'visualizerCircleEnabled'
            },
            visualizerBassBounceEnabled: {
                type: 'checkbox',
                default: true,
                subCheckbox: 'visualizerCircleEnabled'
            },
            visualizerBassBounceSmooth: {
                type: 'checkbox',
                default: true,
                subCheckbox: 'visualizerCircleEnabled'
            },
            visualizerImageType: {
                type: 'customSelect',
                rawOptions: ['Disabled', 'Thumbnail', 'Custom'],
                default: 'Thumbnail',
                subCheckbox: 'visualizerCircleEnabled'
            },
            visualizerImageCustomURL: {
                type: 'textarea',
                default: 'https://imgur.com/HSTpR8R.png',
                subCheckbox: 'visualizerCircleEnabled'
            },
            attention1: {
                section: fieldTexts.attention1Section,
                type: 'hidden'
            },
            visualizerRgbRed: {
                type: 'int',
                min: 0,
                max: 255,
                default: 255
            },
            visualizerRgbGreen: {
                type: 'int',
                min: 0,
                max: 255,
                default: 255
            },
            visualizerRgbBlue: {
                type: 'int',
                min: 0,
                max: 255,
                default: 255
            },
            visualizerRgbSamples: {
                type: 'int',
                min: 1,
                max: 8192,
                default: 512
            },
            visualizerMinDecibels: {
                type: 'int',
                min: -100,
                max: 0,
                default: -85
            },
            visualizerMaxDecibels: {
                type: 'int',
                min: -100,
                max: 0,
                default: 0
            },
            visualizerSmoothing: {
                type: 'float',
                min: 0,
                max: 1,
                default: 0.4
            },
            visualizerMinHertz: {
                type: 'int',
                min: 0,
                max: 44100,
                default: 0
            },
            visualizerMaxHertz: {
                type: 'int',
                min: 1,
                max: 44100,
                default: 4000
            },
            visualizerBassBounceThreshold: {
                type: 'float',
                min: 0,
                max: 1,
                default: 0.45
            },
            visualizerBassBounceMinHertz: {
                type: 'float',
                min: 0,
                max: 44100,
                default: 10
            },
            visualizerBassBounceMaxHertz: {
                type: 'float',
                min: 1,
                max: 44100,
                default: 80
            },
            visualizerBassBounceDebug: {
                type: 'checkbox',
                default: false
            },
            visualizerBassBounceCalculation: {
                type: 'customSelect',
                rawOptions: ['average', 'median'],
                default: 'average'
            },
            visualizerBassBounceFallSmoothing: {
                type: 'int',
                min: 1,
                max: 10,
                default: 5
            },
            visualizerBassBounceGrowSmoothing: {
                type: 'int',
                min: 1,
                max: 10,
                default: 3
            },
            visualizerBassBounceMinRadius: {
                type: 'float',
                min: 0.001,
                max: 100,
                default: 6
            },
            visualizerBassBounceMaxRadius: {
                type: 'float',
                min: 0.001,
                max: 100,
                default: 3
            },
            visualizerEnergySaverFps: {
                type: 'int',
                min: 1,
                max: 144,
                default: 30,
            },
            visualizerRenderScale: {
                type: 'float',
                min: 0.01,
                max: 2,
                default: 1
            },
            visualizerShakeThreshold: {
                type: 'float',
                min: 0,
                max: 1,
                default: 0.5
            },
            visualizerShakeMultiplier: {
                type: 'float',
                min: 0,
                max: 100,
                default: 0.4
            },
            lastOpenCategory: {
                section: fieldTexts.backendSection,
                type: 'hidden',
                default: -1
            },
            shortcut: {
                type: 'hidden',
                default: 'ctrl Backslash|CTRL + ű'
            },
            windowSize: {
                type: 'int',
                min: 0,
                max: 3,
                default: 0
            }
        };

        const customButton = {
            default: 'Change',
            toNode: function() {
                const configId = 'ytmPlusCfg';
                const field = this.settings,
                    id = this.id,
                    create = this.create,
                    format = (field.format || '1'),
                    retNode = create('div', {
                        className: 'config_var',
                        id: configId + '_' + id + '_var',
                        title: field.title || ''
                    });

                this.format = format;

                retNode.appendChild(create('label', {
                    innerHTML: field.label + '<br>' + ytmpConfig.get(field.valueStorage).split('|')[1],
                    id: configId + '_' + id + '_field_label',
                    for: configId + '_field_' + id,
                    className: 'field_label'
                }));

                const props = {
                    id: configId + '_field_' + id,
                    className: 'userButtons',
                    type: 'button',
                    value: 'Change',
                    onclick: field.click,
                };
                retNode.appendChild(create('input', props));

                return retNode;
            },
            toValue: function() { return; },
            reset: function() { return; }
        };

        // ALL THIS BULLSHIT SO THAT SELECT INPUTS CAN CHANGE LANGUAGE
        const customSelect = {
            default: null,
            toNode: function() {
                const configId = 'ytmPlusCfg';
                const field = this.settings,
                    id = this.id,
                    create = this.create,
                    options = field.options,
                    retNode = create('div', {
                        className: 'config_var',
                        id: configId + '_' + id + '_var',
                        title: field.title || ''
                    });

                retNode.appendChild(create('label', {
                    innerHTML: field.label,
                    id: configId + '_' + id + '_field_label',
                    for: configId + '_field_' + id,
                    className: 'field_label'
                }));

                const props = {
                    id: configId + '_field_' + id,
                };
                const selectInput = retNode.appendChild(create('select', props));
                this.node = selectInput;
                for(let i = 0; i < options.length; i++) {
                    selectInput.appendChild(create('option', {
                        innerHTML: options[i],
                        value: field.rawOptions[i],
                    }));
                }
                field.value = this.value;
                selectInput.value = this.value;

                return retNode;
            },
            toValue: function() {
                let returnValue = null;
                if(this.wrapper) {
                    const selectInput = this.wrapper.children[1];
                    returnValue = selectInput.value;
                }
                return returnValue;
            },
            reset: function() {
                if(this.wrapper) {
                    const selectInput = this.wrapper.children[1];
                    selectInput.value = this.default;
                    this.settings.value = this.default;
                }
                return;
            }
        };

        const ytmpConfig = new GM_configStruct({
            id: 'ytmPlusCfg',
            title: 'ytmPlus',
            fields: fixupFields(),
            css: settingsMenu,
            // Moved to index.js so no more circular dependecies (yay?)
            // events: {
            //     open: openEvent,
            //     save: saveEvent
            // },
            frame: injectElement('div', 'ytmPlusCfg', document.body, undefined, 'display: flex'),
            types: {
                customButton: customButton,
                customSelect: customSelect
            }
        });

        function keydownEvent(ev) {
            if(ev.key === 'Escape') return ytmpConfig.close();
            const shortcut = ytmpConfig.get('shortcut').split('|')[0].split(' ');
            if(shortcut.indexOf('ctrl') > -1 && ev.ctrlKey === false) return;
            if(shortcut.indexOf('shift') > -1 && ev.shiftKey === false) return;
            if(shortcut.indexOf('alt') > -1 && ev.altKey === false) return;
            if(shortcut.indexOf(ev.code) < 0) return;

            if(ytmpConfig.isOpen === false) ytmpConfig.open();
            else ytmpConfig.close();
        }

        function injectStyle(css) {
            const node = document.createElement('style');
            const textNode = document.createTextNode(css);
            node.appendChild(textNode);
            return document.head.appendChild(node);
        }

        const elements = { // 200iq commentator, can i please have a large fry
            player: undefined, // Has the sizes we need for album cover canvas
            playerPage: undefined,
            playerPageDiv: undefined, // Set to the player "overlay" in window.onload
            upgradeButton: undefined, // Set to the upgrade "button" in window.onload
            originalUpgradeText: undefined, // OGUpgrade text can differ based on YTM language
            navBarBg: undefined, // Holds the navbar bg's div, visualizer canvas is injected into its innerHTML
            mainPanel: undefined, // Holds something from around the album cover, - - | | - -
            playlist: undefined,
            miniGuide: undefined,
            bigGuide: undefined
        };

        const keyframes = '@keyframes backgroundGradientHorizontal {\r\n    0% {\r\n        background-position: 0% center;\r\n    }\r\n\r\n    100% {\r\n        background-position: 100% center;\r\n    }\r\n}\r\n\r\n@keyframes backgroundGradientVertical {\r\n    0% {\r\n        background-position: center 0%;\r\n    }\r\n\r\n    100% {\r\n        background-position: center 100%;\r\n    }\r\n}\r\n\r\n@keyframes clockGradientHorizontal {\r\n    from {\r\n        background-position: 0% center;\r\n    }\r\n    to {\r\n        background-position: 200% center;\r\n    }\r\n}\r\n\r\n@keyframes clockGradientVertical {\r\n    from {\r\n        background-position: center 0%;\r\n    }\r\n    to {\r\n        background-position: center 200%;\r\n    }\r\n}';

        const visualizer = {
            place: undefined,
            startsFrom: undefined,
            color: undefined,
            fade: undefined,
            circleEnabled: undefined,
            rotate: undefined,
            rotateDirection: undefined,
            move: undefined,
            renderScale: undefined,
            shake: {
                enabled: undefined,
                threshold: undefined,
                multiplier: undefined,
                _normalized: undefined
            },
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
                threshold: undefined,
                minHertz: undefined,
                maxHertz: undefined,
                calculation: undefined,
                smooth: undefined,
                fallSmoothing: undefined,
                growSmoothing: undefined,
                debug: undefined,
                minRadius: undefined,
                maxRadius: undefined,
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
                barTotalHalf: undefined,
                barWidth: undefined,
                barSpace: undefined,
                barHeight: undefined,
                circleSize: undefined,
                radius: 1,
                minRadius: 1,
                maxRadius: 1,
                innerRadius: undefined,
                outerRadius: undefined,
                rotationValue: 0,
                bass: undefined,
                bassSmoothRadius: 1,
                reactiveBarHeightMultiplier: undefined,
                startingPoint: -(0.5 * Math.PI)
            },
            video: undefined,
            audioContext: undefined,
            src: undefined,
            canvas: undefined,
            ctx: undefined,
            minHertz: undefined,
            maxHertz: undefined,
            removedBeginning: undefined,
            removedEnding: undefined,
            colorDivergence: undefined,
            analyser: undefined,
            bufferLength: undefined,
            normalizedAudioData: [],
            audioData: undefined,
            audioDataStep: undefined,
            audioDataLength: undefined,
            resizeInterval: undefined
        };

        const image = new Image();

        function currentVideoURL() {
            return document.getElementsByClassName('ytp-title-link yt-uix-sessionlink')[0];
        }

        function thumbnailChildSrc() {
            try {
                return document.getElementsByClassName('thumbnail style-scope ytmusic-player no-transition')[0].firstElementChild.src;
            }
            catch {
                return undefined;
            }
        }

        let imgLoaded = false, lastSavedVideoURL, currentImageURL, widthRatio, heightRatio, quality = 'maxresdefault', loadedQuality;

        image.onload = () => {
            if(image.height < 100) { // very likely a 404
                imgLoaded = false;
                if(quality === 'maxresdefault') quality = 'sddefault';
                else if(quality === 'sddefault') quality = 'hqdefault';
                else if(quality === 'hqdefault') quality = 'mqdefault';
                return replaceImageURL();
            }
            heightRatio = image.height / image.width;
            widthRatio = image.width / image.height;
            imgLoaded = true;
            loadedQuality = quality;
            console.log('Image loaded successfully');
            quality = 'maxresdefault';
        };

        image.onerror = (err) => { // thumbnails return a very small image on 404 so this is mostly for customs
            console.error(err);
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
            if(visualizer.image.type === 'Custom') {
                console.warn('Thumbnail event called with custom image');
                return;
            }
            currentImageURL = thumbnailChildSrc();
            if(!currentImageURL) {
                console.log('thumbnailChildSrc is undefined');
                return;
            }

            if(currentImageURL.indexOf('data') !== 0) {
                console.log('Current image URL is valid');
                if(image.src === currentImageURL) {
                    console.log('but is already thumbnail');
                    return;
                }
                console.log('Setting it to image source');
                lastSavedVideoURL = currentVideoURL().href;
                return finalize();
            }

            console.log('Current image URL is data, cannot be image source');

            if(lastSavedVideoURL !== currentVideoURL().href) {
                lastSavedVideoURL = currentVideoURL().href;
                console.log(`Changed lastSavedVideoURL to: ${lastSavedVideoURL}`);
            }

            if(!lastSavedVideoURL) {
                console.log('lastSavedVideoURL is empty, currentVideoURL.href is likely undefined');
                return;
            }

            imgLoaded = false;
            currentImageURL = `https://i.ytimg.com/vi/${lastSavedVideoURL.split('v=')[1]}/${quality}.jpg`;
            console.log(`Trying to load with quality: ${quality}`);
            finalize();
        }

        function customEvent() {
            if(currentImageURL === visualizer.image.customURL) {
                console.log('Custom Image change: URL is the same');
                return;
            }
            currentImageURL = visualizer.image.customURL;
            finalize();
        }

        function finalize() {
            console.log(`Changed currentImageURL to: ${currentImageURL}`);
            imgLoaded = false;
            image.src = currentImageURL;
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

            let radiusMultX = visualizer.values.radius,
                radiusMultY = 1; // default visualizer.values for 1:1 aspect ratio

            if(loadedQuality !== 'maxresdefault' && visualizer.image.type !== 'Custom') { // enlarge image to cut off "cinematic bars"
                radiusMultX *= 1.33;
                radiusMultY = widthRatio;
            }
            else if(heightRatio > 1) { // vertical img handling
                radiusMultX *= heightRatio;
                radiusMultY = widthRatio;
            }
            else radiusMultY *= widthRatio; // horizontal img handling

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
            visualizer.bassBounce._barStart = ~~(visualizer.bassBounce.minHertz / visualizer.audioDataStep);
            visualizer.bassBounce._barEnd = ~~(visualizer.bassBounce.maxHertz / visualizer.audioDataStep);
            if(visualizer.bassBounce._barEnd === 0) visualizer.bassBounce._barEnd++;
        }

        function getBufferData() {
            visualizer.analyser.fftSize = ytmpConfig.get('visualizerFft');
            visualizer.minHertz = ytmpConfig.get('visualizerMinHertz');
            visualizer.maxHertz = ytmpConfig.get('visualizerMaxHertz');
            visualizer.bufferLength = visualizer.analyser.frequencyBinCount; // bufferLength is fftSize / 2, means how much data we will have in audioData
            visualizer.audioDataStep = visualizer.audioContext.sampleRate / visualizer.analyser.fftSize; // 1 step = 1 audio data Hz range
            // e.g.: FFT = 4096, sampleRate = 48000 | 48000 / 4096 = ~21.5Hz, audioData[0] would contain 0Hz -> 21.5Hz of audio
            visualizer.removedBeginning = ~~(visualizer.minHertz / visualizer.audioDataStep);
            visualizer.removedEnding = ~~(visualizer.maxHertz / visualizer.audioDataStep);
            visualizer.audioDataLength = visualizer.removedEnding - visualizer.removedBeginning;
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

                switch(visualizer.bassBounce.calculation) {
                    default: case 'average': calcFunction = averageOfArray; break;
                    case 'median': calcFunction = medianOfArray; break;
                }

                // Last things to do (everything here runs only once)
                if(visualizer.analyser !== undefined) {
                    visualizer.analyser.smoothingTimeConstant = ytmpConfig.get('visualizerSmoothing');
                    visualizer.analyser.minDecibels = ytmpConfig.get('visualizerMinDecibels');
                    visualizer.analyser.maxDecibels = ytmpConfig.get('visualizerMaxDecibels');
                    calculateBassBounceBars();
                }

                visualizer.colorDivergence = visualizer.audioDataLength / visualizer.rgb.samples;
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

        function setCanvas(canvas) {
            visualizer.canvas = canvas;
            visualizer.ctx.clearRect(0, 0, visualizer.values.WIDTH, visualizer.values.HEIGHT);
            visualizer.ctx = visualizer.canvas.getContext('2d');
            console.log(`Canvas set to: ${visualizer.canvas.id}`);
        }

        function visualizerResizeFix() {
            let currentCanvasHolder;
            switch(visualizer.canvas.id) {
                case visualizer.canvases.navbar.id: currentCanvasHolder = elements.navBarBg; break;
                case visualizer.canvases.albumCover.id: currentCanvasHolder = elements.player; break;
                case visualizer.canvases.playerBackground.id: currentCanvasHolder = visualizer.canvases.playerBackground; break;
                case visualizer.canvases.background.id: currentCanvasHolder = visualizer.canvases.background; break;
                default: throw new Error('visualizer.canvas.id is not valid!');
            }

            // Check if canvas corresponds to selected place
            if(visualizer.place === 'Navbar' && visualizer.canvas.id !== visualizer.canvases.navbar.id) setCanvas(visualizer.canvases.navbar);
            else if(visualizer.place === 'Album Cover' && visualizer.canvas.id !== visualizer.canvases.albumCover.id) setCanvas(visualizer.canvases.albumCover);
            else if(visualizer.place === 'Background') {
                if(elements.player.playerUiState === 'MINIPLAYER') {
                    if(visualizer.canvas.id !== visualizer.canvases.background.id) setCanvas(visualizer.canvases.background);
                }
                else if(elements.player.playerUiState === 'FULLSCREEN') {
                // playerBackground canvas height is not 100vh because YTM is a piece of fucking shit and my brain doesn't let me "hide" the bottom of the canvas under the miniplayer thing
                // so to not have to fuck with scaling, we just switch to the already perfectly scaled album cover, EZ Clap
                    if(visualizer.canvas.id !== visualizer.canvases.albumCover.id) setCanvas(visualizer.canvases.albumCover);
                }
                else if(visualizer.canvas.id !== visualizer.canvases.playerBackground.id) setCanvas(visualizer.canvases.playerBackground);
            }

            if(visualizer.canvas.width !== ~~(currentCanvasHolder.offsetWidth * visualizer.renderScale)) visualizer.canvas.width = currentCanvasHolder.offsetWidth * visualizer.renderScale;
            if(visualizer.canvas.height !== ~~(currentCanvasHolder.offsetHeight * visualizer.renderScale)) visualizer.canvas.height = currentCanvasHolder.offsetHeight * visualizer.renderScale;

            visualizer.values.WIDTH = visualizer.canvas.width;
            visualizer.values.halfWidth = visualizer.values.WIDTH / 2;
            visualizer.values.HEIGHT = visualizer.canvas.height;
            visualizer.values.halfHeight = visualizer.values.HEIGHT / 2;

            // Fixes visualizer offset / Fixes album cover getting incosistent sizes if moved to different resolution displays
            // Commented out because it breaks more shit than it fixes
            // elements.player.style.margin = 'auto 0px';

            if(visualizer.circleEnabled === true && visualizer.canvas.id !== visualizer.canvases.navbar.id) {
                if(visualizer.bassBounce.enabled === true) {
                    visualizer.values.minRadius = ~~(visualizer.values.HEIGHT / visualizer.bassBounce.minRadius);
                    visualizer.values.maxRadius = ~~(visualizer.values.HEIGHT / visualizer.bassBounce.maxRadius);
                }
                else {
                    visualizer.values.radius = ~~(visualizer.values.HEIGHT / 4);
                    visualizer.values.maxRadius = visualizer.values.radius;
                }

                visualizer.values.barTotal = visualizer.values.circleSize * Math.PI / (visualizer.audioDataLength - 2 + visualizer.values.circleSize);
                visualizer.values.barTotalHalf = visualizer.values.barTotal / 2;
                visualizer.values.barWidth = visualizer.values.barTotal * 0.45;
            }
            else {
                if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') visualizer.values.barTotal = visualizer.values.halfWidth / visualizer.audioDataLength;
                else visualizer.values.barTotal = visualizer.values.WIDTH / visualizer.audioDataLength;
                visualizer.values.barSpace = visualizer.values.barTotal * 0.05;
                visualizer.values.barWidth = visualizer.values.barTotal * 0.95;
            }
        }

        let calcFunction;

        function averageOfArray(numbers) {
            let result = 0;
            for(let i = 0; i < numbers.length; i++) result += numbers[i];
            return result / numbers.length;
        }

        function medianOfArray(values) {
            if(values.length === 0) throw new Error('Array is empty');

            values = [...values].sort((a, b) => a - b);
            const half = Math.floor(values.length / 2);

            if(values.length % 2 === 0) return values[half];
            return (values[half - 1] + values[half]) / 2;
        }

        function getBarColor(i) {
            if(visualizer.bassBounce.debug === true && i <= visualizer.bassBounce._barEnd && i >= visualizer.bassBounce._barStart) return visualizer.ctx.fillStyle = '#FFF';
            i -= visualizer.removedBeginning;
            if(visualizer.rgb.enabled === true) {
            // Limits iteration for rgb._data, so we don't go out of bounds but also use every color available
                const colors = visualizer.rgb._data[~~(i / visualizer.colorDivergence)];

                if(visualizer.fade === true) visualizer.ctx.fillStyle = `rgba(${colors.red}, ${colors.green}, ${colors.blue}, ${visualizer.audioData[i] < 128 ? visualizer.audioData[i] * 2 / 255 : 1.0})`;
                else visualizer.ctx.fillStyle = `rgb(${colors.red}, ${colors.green}, ${colors.blue})`;
            }
            else if(visualizer.fade === true) visualizer.ctx.fillStyle = visualizer.color + (visualizer.audioData[i] < 128 ? (visualizer.audioData[i] * 2).toString(16) : 'FF');
            else visualizer.ctx.fillStyle = visualizer.color;
        }

        function calculateBass() {
            visualizer.values.bass = visualizer.normalizedAudioData.slice(visualizer.bassBounce._barStart, visualizer.bassBounce._barEnd);

            const maxAddedRadius = visualizer.values.maxRadius - visualizer.values.minRadius;

            visualizer.values.bassSmoothRadius = calcFunction(visualizer.values.bass); // averageOfArray(visualizer.values.bass);

            if(visualizer.bassBounce.enabled === true) {
                const n = visualizer.bassBounce.fallSmoothing;
                const n2 = visualizer.bassBounce.growSmoothing;
                if(visualizer.values.bassSmoothRadius < visualizer.bassBounce.threshold) return visualizer.values.radius = ((visualizer.values.radius * n) + visualizer.values.minRadius) / (n + 1);

                const newRadius = visualizer.values.minRadius + visualizer.values.bassSmoothRadius * maxAddedRadius;

                if(visualizer.bassBounce.smooth === true) visualizer.values.radius = ((visualizer.values.radius * n2) + newRadius) / (n2 + 1);
                else visualizer.values.radius = newRadius;
            }
        }

        function getRotationValue() {
            const direction = (visualizer.rotateDirection === 'Clockwise') ? 1 : -1;

            switch(visualizer.rotate) {
                case 'Disabled': default: { visualizer.values.rotationValue = 0; } break;
                case 'On': { visualizer.values.rotationValue += 0.005 * direction; } break;
                case 'Reactive': { visualizer.values.rotationValue += (Math.pow(averageOfArray(visualizer.normalizedAudioData) / 100 + 1, 2) - 1) * direction; } break;
                case 'Reactive (Bass)': { visualizer.values.rotationValue += (Math.pow(visualizer.values.bassSmoothRadius / 100 + 1, 2) - 1) * direction; } break;
            }
        }

        function visualizerCircle() { // Bitwise truncation (~~number) is used here instead of Math.floor() to squish out more performance.
            const doWeShake = visualizer.shake.enabled === true && visualizer.values.bassSmoothRadius > visualizer.shake.threshold;
            if(doWeShake === true) preShake();

            if(visualizer.startsFrom === 'Left' || visualizer.startsFrom === 'Right') visualizer.values.circleSize = 2; // 2(pi) = full
            else visualizer.values.circleSize = 1; // 1(pi) = half;

            if(visualizer.bassBounce.enabled === true || visualizer.shake.enabled === true || visualizer.rotate === 'Reactive (Bass)') calculateBass();

            getRotationValue();

            if(visualizer.image.type !== 'Disabled' && imgLoaded === true) drawVisImage();

            const maxBarHeight = (visualizer.values.halfHeight) - (visualizer.values.maxRadius);

            if(visualizer.startsFrom === 'Right') drawArcs(false, maxBarHeight);
            else if(visualizer.startsFrom === 'Left') drawArcs(true, maxBarHeight);
            else if(visualizer.startsFrom === 'Center') {
                drawArcs(false, maxBarHeight);
                drawArcs(true, maxBarHeight);
            }
            else if(visualizer.startsFrom === 'Edges') {
                drawArcs(false, maxBarHeight);
                drawArcs(false, maxBarHeight, 3);
            }

            if(doWeShake === true) postShake();
        }

        function drawArcs(backwards, maxBarHeight, startPoint = 1) {
            visualizer.ctx.save();
            visualizer.ctx.translate(visualizer.values.halfWidth, visualizer.values.halfHeight); // move to center of circle
            visualizer.ctx.rotate(visualizer.values.startingPoint * startPoint + (visualizer.values.barTotalHalf + visualizer.values.rotationValue)); // Set bar starting point to top + rotation

            for(let i = visualizer.removedBeginning; i < visualizer.removedEnding; i++) {
                getBarColor(i);
                const barHeight = visualizer.normalizedAudioData[i] * maxBarHeight;

                if(visualizer.move === 'Outside' || visualizer.move === 'Both Sides') visualizer.values.outerRadius = visualizer.values.radius + barHeight;
                else visualizer.values.outerRadius = visualizer.values.radius;

                if(visualizer.move === 'Inside' || visualizer.move === 'Both Sides') visualizer.values.innerRadius = visualizer.values.radius - barHeight;
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

        function preShake() {
            visualizer.ctx.save();
            const movement = visualizer.values.halfHeight * 0.01 * visualizer.shake.multiplier;
            let dx = movement, dy = movement;
            if(~~(Math.random() * 2) === 0) dx *= 1;
            else dx *= -1;
            if(~~(Math.random() * 2) === 0) dy *= 1;
            else dy *= -1;
            visualizer.ctx.translate(dx, dy);
        }

        function postShake() {
            visualizer.ctx.restore();
        }

        function visualizerNavbar() {
            let xPosOffset;
            if(visualizer.startsFrom === 'Center') xPosOffset = visualizer.values.barWidth + visualizer.values.barSpace / 2; // Centers 1 bar
            else if(visualizer.startsFrom === 'Edges') xPosOffset = visualizer.values.barSpace / 2; // Both sides are offset a bit for perfect centering
            else xPosOffset = 0;

            const maxBarHeight = visualizer.values.HEIGHT;

            firstDraw(maxBarHeight, xPosOffset);

            if(visualizer.startsFrom === 'Center') {
                xPosOffset = visualizer.values.halfWidth + visualizer.values.barSpace / 2; // Reset pos to center
                secondDraw(maxBarHeight, xPosOffset);
            }
            else if(visualizer.startsFrom === 'Edges') {
                xPosOffset = visualizer.values.barWidth + (visualizer.values.barSpace / 2); // Reset pos to right + offset for perfect center
                secondDraw(maxBarHeight, xPosOffset);
            }
        }

        function firstDraw(maxBarHeight, xPosOffset) {
            for(let i = visualizer.removedBeginning; i < visualizer.removedEnding; i++) {
                const barHeight = visualizer.normalizedAudioData[i] * maxBarHeight;

                getBarColor(i);

                // To this day I don't get the Y and height values
                if(visualizer.startsFrom === 'Left') {
                    visualizer.ctx.fillRect( // Draws rect from left to right
                        xPosOffset,
                        visualizer.values.HEIGHT - barHeight,
                        visualizer.values.barWidth,
                        barHeight
                    );
                }
                else if(visualizer.startsFrom === 'Center') {
                    if(visualizer.values.halfWidth - xPosOffset < 0 - visualizer.values.barWidth) break;
                    visualizer.ctx.fillRect( // Draws rect from left to right, starting from center to left
                        visualizer.values.halfWidth - xPosOffset,
                        visualizer.values.HEIGHT - barHeight,
                        visualizer.values.barWidth,
                        barHeight
                    );
                }
                else if(visualizer.startsFrom === 'Right') {
                    visualizer.ctx.fillRect( // Draws rect from right to left
                        visualizer.values.WIDTH - xPosOffset,
                        visualizer.values.HEIGHT - barHeight,
                        0 - visualizer.values.barWidth,
                        barHeight
                    );
                }
                else if(visualizer.startsFrom === 'Edges') {
                    if(xPosOffset > visualizer.values.halfWidth) break;
                    visualizer.ctx.fillRect( // Draws rect from left to right, from left to center
                        xPosOffset,
                        visualizer.values.HEIGHT - barHeight,
                        visualizer.values.barWidth,
                        barHeight
                    );
                }
                xPosOffset += visualizer.values.barTotal;
            }
        }

        function secondDraw(maxBarHeight, xPosOffset) {
            for(let i = visualizer.removedBeginning; i < visualizer.removedEnding; i++) {
                const barHeight = visualizer.normalizedAudioData[i] * maxBarHeight;

                getBarColor(i);

                if(visualizer.startsFrom === 'Center') {
                    if(xPosOffset > visualizer.values.WIDTH) break;
                    visualizer.ctx.fillRect( // Draws rect from left to right, from center to right
                        xPosOffset,
                        visualizer.values.HEIGHT - barHeight,
                        visualizer.values.barWidth,
                        barHeight
                    );
                }
                else if(visualizer.startsFrom === 'Edges') {
                    if(xPosOffset > visualizer.values.halfWidth) break;
                    visualizer.ctx.fillRect( // Draws rect from left to right, from right to center
                        visualizer.values.WIDTH - xPosOffset,
                        visualizer.values.HEIGHT - barHeight,
                        visualizer.values.barWidth,
                        barHeight
                    );
                }
                xPosOffset += visualizer.values.barTotal;
            }
        }

        let lastFrameTime = 0;

        // NEVER REMOVE TIME FROM HERE DESPITE THE FACT THE **WE** NEVER CALL IT, BROWSERS DO (OR SOMETHING LIKE THAT)
        function renderFrame(time) {
        // Don't do anything if True Pause energy saver is on and playback is paused
            if((visualizer.energySaver.type === 'True Pause' || visualizer.energySaver.type === 'Both') && visualizer.video.paused === true) return requestAnimationFrame(renderFrame);

            // If render would be faster than max fps (60 by default if energy saver is off) come back later
            if(time - lastFrameTime < visualizer.energySaver._frameMinTime) return requestAnimationFrame(renderFrame);

            lastFrameTime = time;

            visualizer.ctx.clearRect(0, 0, visualizer.values.WIDTH, visualizer.values.HEIGHT);

            // Kill everything if disabled, can be turned back by simply calling requestAnimationFrame(renderFrame)
            if(visualizer.place === 'Disabled') return;

            // Get audio data
            visualizer.analyser.getByteFrequencyData(visualizer.audioData);

            // Normalize audio data to 0 - 1
            for(let i = 0; i < visualizer.audioData.length; i++) visualizer.normalizedAudioData[i] = visualizer.audioData[i] / 255;

            // Cheap color cycle effect, speed scales with fps so probably not the best
            if(visualizer.rgb.enabled === true) {
                visualizer.rgb._data.push(visualizer.rgb._data[0]);
                visualizer.rgb._data.shift();
            }

            if(visualizer.circleEnabled === true && visualizer.canvas.id !== visualizer.canvases.navbar.id) visualizerCircle(visualizer.ctx);
            else visualizerNavbar(visualizer.ctx);

            requestAnimationFrame(renderFrame);
        }

        async function setupVisualizer() {
        // Injecting visualizer visualizer.canvases
            visualizer.canvases.navbar = await injectElement('canvas', 'visualizerNavbarCanvas', elements.navBarBg, undefined, 'position: absolute; left: 0; top: 0; width: 100%; height: inherit; pointer-events: none;');
            visualizer.canvases.albumCover = await injectElement('canvas', 'visualizerAlbumCoverCanvas', elements.player, undefined, 'position: absolute; z-index: 9999; pointer-events: none; visibility: visible; width: 100%; height: 100%;', true);
            elements.navBarBg.style.opacity = 1;

            // 64px is navbar, 72px is bottom player controls
            visualizer.canvases.background = await injectElement('canvas', 'visualizerBackgroundCanvas', document.getElementById('content'), undefined, 'position: fixed; z-index: -1; pointer-events: none; visibility: visible; width: 100%; height: calc(100vh - (64px + 72px)); margin-top: 64px;', true);
            visualizer.canvases.playerBackground = await injectElement('canvas', 'visualizerPlayerBackgroundCanvas', document.getElementById('player-page'), undefined, 'position: absolute; z-index: -1; pointer-events: none; visibility: visible; width: inherit; height: inherit;', true);

            // Hides playlist when in fullscreen (otherwise it's visible if album cover is removed i think)
            const playerObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if(mutation.attributeName === 'player-ui-state') {
                        if(elements.player.playerUiState !== 'FULLSCREEN' && elements.playlist.style.visibility !== 'visible') elements.playlist.style.visibility = 'visible'; // .removeProperty('visibility');
                        else if(elements.player.playerUiState === 'FULLSCREEN' && elements.playlist.style.visibility !== 'hidden') elements.playlist.style.visibility = 'hidden';
                    }
                });
            });
            playerObserver.observe(elements.player, { attributes: true });

            getVideo();
        }

        function getVideo() {
            visualizer.video = document.querySelector('video');
            if(visualizer.video) {
            // visualizer.video.style.position = 'static'; // i guess it fixes videos being offset when refreshing a video (??????)
                console.log('Found video.');
                startVisualizer();
            }
            else {
                console.warn('Query "video" not found, retrying in 100ms.');
                setTimeout(getVideo, 100);
            }
        }

        function startVisualizer() {
            try {
            // Init, connecting yt audio to visualizer.canvas
                if(visualizer.audioContext === undefined) {
                    visualizer.audioContext = new AudioContext();
                    visualizer.src = visualizer.audioContext.createMediaElementSource(visualizer.video);
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
            catch (error) {
                console.error(error);
            }
        }

        const cogFrame = '#cogBigHolder {\r\n    width: 30px;\r\n    height: 30px;\r\n    margin-left: 20px;\r\n}\r\n\r\n#cogRotator {\r\n    height: 100%;\r\n    opacity: 1;\r\n    transform: rotate(0);\r\n    filter: drop-shadow(0px 0px 0px #ff00ff);\r\n    transition: 0.15s ease-in-out;\r\n}\r\n\r\n#cogBigHolder:hover #cogRotator {\r\n    transform: rotate(90deg);\r\n    filter: drop-shadow(0px 0px 8px #ff00ff);\r\n}\r\n';

        async function createCogFrame() {
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

        function changeWindowSize(option) {
            if(option === 'small') {
                ytmpConfig.frame.style.height = '512px';
                ytmpConfig.frame.style.fontSize = '12px';
            }
            else if(option === 'medium') {
                ytmpConfig.frame.style.height = '768px';
                ytmpConfig.frame.style.fontSize = '18px';
            }
            else if(option === 'large') {
                ytmpConfig.frame.style.height = '1080px';
                ytmpConfig.frame.style.fontSize = '24px';
            }
            else {
                ytmpConfig.frame.style.removeProperty('height');
                ytmpConfig.frame.style.removeProperty('font-size');
            }
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

        const functions = {
            clock: undefined, // Holds the interval function that updates the digital clock
            neverAfk: undefined, // Holds the anti-afk interval function
            noPromotions: undefined, // Holds the no promotions function
            skipDisliked: undefined, // Holds the skip disliked songs function
            fixLayout: undefined
        };

        const layoutOverrides = 'ytmusic-player {\r\n    width: 75%; /* we should make this customizable, so visualizer can be BIG */\r\n}\r\n\r\nytmusic-tab-renderer {\r\n    flex: unset;\r\n}\r\n\r\ntp-yt-paper-tabs {\r\n    flex: none;\r\n}\r\n\r\n#contents.ytmusic-section-list-renderer>ytmusic-carousel-shelf-renderer.ytmusic-section-list-renderer:not(:last-child) {\r\n    margin-bottom: 0; /* remove random retarded padding on related list */\r\n}\r\n\r\nytmusic-tab-renderer[page-type="MUSIC_PAGE_TYPE_TRACK_LYRICS"] {\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n\r\n.description.ytmusic-description-shelf-renderer {\r\n    display: unset; /* we can center lyrics now, yippie! (WHY THO) */\r\n}\r\n\r\nhtml {\r\n    scrollbar-color: unset;\r\n}';

        let layoutCss;
        function fixLayout(turnOn) {
            if(!turnOn) {
                clearInterval(functions.fixLayout);
                elements.player.style.removeProperty('flex');
                // elements.player.style.removeProperty('width');
                elements.player.style.removeProperty('margin');
                elements.playerPageDiv.style.removeProperty('padding');
                elements.mainPanel.style.removeProperty('align-items');
                elements.mainPanel.style.removeProperty('justify-content');
                try {
                    layoutCss = layoutCss.remove();
                }
                catch {}
                return;
            }

            functions.fixLayout = setInterval(() => {
                if(elements.player.style.margin !== '0px') elements.player.style.margin = '0px';
            // if(elements.player.playerUiState_ === 'MINIPLAYER') elements.player.style.removeProperty('width');
            // else elements.player.style.width = '75%';
            }, 1000);
            elements.player.style.flex = 'unset';
            elements.playerPageDiv.style.padding = '0px var(--ytmusic-player-page-horizontal-padding)';
            elements.mainPanel.style.alignItems = 'center';
            elements.mainPanel.style.justifyContent = 'center';
            elements.playlist.style.justifyContent = 'center';
            // layoutCss = injectStyle(layoutOverrides);
            if(!layoutCss) layoutCss = injectStyle(layoutOverrides);
        }

        function navbarBackgroundChange(turnOn) {
            if(!turnOn) return elements.navBarBg.style.removeProperty('background-image');

            elements.navBarBg.style.backgroundImage = `linear-gradient(${ytmpConfig.get('navbarBackgroundGradientAngle')}deg, ${ytmpConfig.get('navbarBackgroundColor')}, ${ytmpConfig.get('navbarBackgroundGradientEnabled') === true ? ytmpConfig.get('navbarBackgroundGradientColor') : ytmpConfig.get('navbarBackgroundColor')})`;
            elements.navBarBg.style.backgroundAttachment = 'fixed';

            animateNavbar(elements.navBarBg.style, null, ytmpConfig.get('navbarBackgroundGradientAnimation'));
        }


        function animateNavbar(elementStyle, overflowOn, animation) {
            if(animation !== 'Disabled') {
                elementStyle.backgroundSize = '200% 200%';
                elements.navBarBg.style.backgroundImage = `linear-gradient(${ytmpConfig.get('navbarBackgroundGradientAngle')}deg, ${ytmpConfig.get('navbarBackgroundColor')}, ${ytmpConfig.get('navbarBackgroundGradientEnabled') === true ? ytmpConfig.get('navbarBackgroundGradientColor') : ytmpConfig.get('navbarBackgroundColor')})`;
                elements.navBarBg.style.backgroundAttachment = 'fixed';
                elementStyle.animation = `backgroundGradient${animation} 5s linear infinite alternate`;
            }
            else {
                elementStyle.backgroundSize = '100% 100%';
                elementStyle.animation = '';
                elementStyle.backgroundPosition = 'center center';
            }

        // if(overflowOn === false) elementStyle.overflow = 'hidden';
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

        async function removeAlbumCover(turnOn) {
            elements.player.style.backgroundColor = '#00000001'; // minimal visibility required so shit doesn't break, don't ask
            const songImage = document.getElementById('song-image');
            const songMediaControls = await elements.player.children[elements.player.children.length - 2];

            if(!turnOn) {
                songImage.style.opacity = 1;
                songMediaControls.style.removeProperty('background');
            }
            else {
                songImage.style.opacity = 0.001;
                songMediaControls.style.background = '#0000';
            }
        }

        // import { elements } from '../../globals/elements';

        async function removeUpgradeButton(turnOn) {
            if(!turnOn) {
                elements.bigGuide.lastElementChild.style.display = 'inline-block';
                elements.miniGuide.lastElementChild.style.display = 'inline-block';
                return;
            }

            elements.bigGuide.lastElementChild.style.display = 'none';

            if(!elements.miniGuide) {
                const guides = await document.getElementsByTagName('ytmusic-guide-section-renderer');
                if(guides.length < 3) return;
                elements.miniGuide = guides[2].children[2];
            }

            elements.miniGuide.lastElementChild.style.display = 'none';
        }

        // let currentTime;
        // clearInterval(functions.clockFunction);
        // if(mode === 'Original') {
        //     elements.upgradeButton.textContent = elements.originalUpgradeText;
        //     elements.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
        // }
        // else if(mode === 'Digital Clock') {
        //     functions.clockFunction = setInterval(() => {
        //         currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        //         elements.upgradeButton.textContent = currentTime;
        //     }, 1000);
        //     elements.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
        // }
        // else {
        //     elements.upgradeButton.textContent = '';
        //     elements.upgradeButton.parentElement.style.margin = '0px';
        // }

        // // Trust me this is the way
        // const buttonStyle = elements.upgradeButton.style;
        // if(mode === 'Digital Clock') {
        //     buttonStyle.background = `linear-gradient(${ytmpConfig.get('clockGradientAngle')}deg, ${ytmpConfig.get('clockColor')} 0%, ${ytmpConfig.get('clockGradient') === true ? ytmpConfig.get('clockGradientColor') : ytmpConfig.get('clockColor')} 50%, ${ytmpConfig.get('clockColor')} 100%)`;
        //     buttonStyle.backgroundSize = '200% 200%';
        //     buttonStyle.backgroundClip = 'text';
        //     buttonStyle.textFillColor = 'transparent';
        //     buttonStyle.webkitBackgroundClip = 'text';
        //     buttonStyle.webkitTextFillColor = 'transparent';
        //     buttonStyle.fontSize = '50px';
        //     const animation = ytmpConfig.get('clockGradientAnimation');
        //     if(animation === 'Horizontal') buttonStyle.animation = 'clockGradientHorizontal 2s linear infinite normal';
        //     else if(animation === 'Vertical') buttonStyle.animation = 'clockGradientVertical 2s linear infinite normal';
        //     else buttonStyle.animation = '';
        // }
        // else {
        //     buttonStyle.background = '';
        //     buttonStyle.backgroundSize = '';
        //     buttonStyle.backgroundClip = '';
        //     buttonStyle.textFillColor = '';
        //     buttonStyle.webkitBackgroundClip = '';
        //     buttonStyle.webkitTextFillColor = '';
        //     buttonStyle.fontSize = '20px';
        // }

        function siteBackgroundChange(turnOn) {
            if(turnOn === false) {
                if(document.body.style.backgroundImage !== '') {
                    document.body.style.backgroundColor = '#000000';
                    document.body.style.backgroundImage = '';
                    elements.playerPage.style.background = '';
                }
                return;
            }

            document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';
            const animation = ytmpConfig.get('siteBackgroundGradientAnimation');
            animateBackground(document.body.style, true, animation);
            animateBackground(elements.playerPage.style, false, animation);

            const browsePages = document.getElementsByTagName('ytmusic-browse-response');
            if(browsePages.length === 0) return console.error('BackgroundError: No browsePage');
            if(browsePages[0].children.length === 0) return console.error('BackgroundError: No browsePage children');
            const maybeBackground = browsePages[0].children[0];
            if(maybeBackground.id === 'background') maybeBackground.remove();
        }

        function animateBackground(elementStyle, overflowOn, animation) {
            elementStyle.backgroundImage = `linear-gradient(${ytmpConfig.get('siteBackgroundGradientAngle')}deg, ${ytmpConfig.get('siteBackgroundColor')}, ${ytmpConfig.get('siteBackgroundGradientEnabled') === true ? ytmpConfig.get('siteBackgroundGradientColor') : ytmpConfig.get('siteBackgroundColor')})`;
            elementStyle.backgroundAttachment = 'fixed';

            if(animation !== 'Disabled') {
                elementStyle.backgroundSize = '200% 200%';
                elementStyle.animation = `backgroundGradient${animation} 5s linear infinite alternate`;
            }
            else {
                elementStyle.backgroundSize = '100% 100%';
                elementStyle.animation = '';
                elementStyle.backgroundPosition = 'center center';
            }

        // if(overflowOn === false) elementStyle.overflow = 'hidden';
        }

        function skipDisliked(turnOn) {
            musicTitleObserver.disconnect();
            if(turnOn === true) musicTitleObserver.observe(document.getElementsByClassName('title style-scope ytmusic-player-bar')[0], { childList: true });
        }

        // We skip after 5 seconds to let everything load and to not skip not disliked songs (huh?)
        function checkDislike() {
            console.log('Checking dislike in 3 seconds...');
            clearTimeout(functions.skipDislikedFunction);

            // If we don't time this out, we get the ability to skip at least 20 songs in a matter of seconds before it realizes it's not supposed to skip
            // also user gets time to undislike the song if they want to
            // maybe timeout could be customizable too
            functions.skipDislikedFunction = setTimeout(async () => {
                const likeButton = await document.getElementById('like-button-renderer');
                if(!likeButton) return console.log('Could not find like button, skipping check');
                if(likeButton.children[0].ariaPressed == 'true') {
                    console.log('Song is disliked, skipping');
                    return document.getElementsByClassName('next-button style-scope ytmusic-player-bar')[0].click();
                }
                console.log('Song is not disliked, not skipping');
            }, 3000);
        }

        const musicTitleObserver = new MutationObserver(checkDislike);

        async function swapMainPanelWithPlaylist(turnOn) {
            if(turnOn) {
                if(elements.mainPanel.parentNode.lastElementChild.id === elements.mainPanel.id) return;
                await elements.mainPanel.parentNode.append(elements.mainPanel);
                elements.playlist.style.margin = '0 var(--ytmusic-player-page-content-gap) 0 0';
            }
            else {
                if(elements.mainPanel.parentNode.firstElementChild.id === elements.mainPanel.id) return;
                await elements.mainPanel.parentNode.prepend(elements.mainPanel);
                elements.playlist.style.margin = '0 0 0 var(--ytmusic-player-page-content-gap)';
            }
        }

        function unlockWidth(option) {
            if(option === 'Playlist') {
                elements.playlist.style.maxWidth = 'unset';
                elements.player.style.removeProperty('max-width');
            }
            else if(option === 'Album Cover') {
                elements.player.style.maxWidth = 'unset';
                elements.playlist.style.removeProperty('max-width');
            }
            else if(option === 'Both') {
                elements.player.style.maxWidth = 'unset';
                elements.playlist.style.maxWidth = 'unset';
            }
            else {
                elements.player.style.removeProperty('max-width');
                elements.playlist.style.removeProperty('max-width');
            }
        }

        let clone;
        function videoSongSwitcher(turnOn) {
            const avSwitch = document.getElementById('av-id');
            if(!turnOn) {
                elements.player.removeAttribute('has-av-switcher');
                elements.playerPage.removeAttribute('has-av-switcher');
                avSwitch.style.display = 'none';
                if(clone) clone.style.display = 'none';
                return;
            }
            elements.player.setAttribute('has-av-switcher', true);
            elements.playerPage.setAttribute('has-av-switcher', true);
            avSwitch.style.display = 'none';
            if(clone) return clone.style.display = 'block';

            try {
                if(avSwitch.parentNode.tagName == 'YTMUSIC-NAV-BAR') return;
                const navbar = document.getElementsByTagName('ytmusic-nav-bar')[0];
                navbar.children[1].style.justifyContent = 'space-around';
                clone = avSwitch.cloneNode(true);
                navbar.children[1].append(clone);
                clone.style.display = 'block';
            }
            catch (err) {
                console.error(err);
            }
        }

        // Collection of functions that are called windowLoad or onSave
        const toCallOnEvents = {
            changeWindowSize,
            extraPlaybackButtons,
            fixLayout,
            navbarBackgroundChange,
            neverAfk,
            noPromotions,
            removeAlbumCover,
            removeUpgradeButton,
            siteBackgroundChange,
            skipDisliked,
            swapMainPanelWithPlaylist,
            unlockWidth,
            videoSongSwitcher
        };

        async function setup() {
            console.log('ytmPlus: Setup started.');
            try {
                elements.player = await document.getElementById('player');
                elements.playerPage = await document.getElementById('player-page');
                elements.playerPageDiv = elements.playerPage.firstElementChild;
                elements.navBarBg = await document.getElementById('nav-bar-background');
                elements.mainPanel = await document.getElementById('main-panel');
                const playlistFinder = await document.getElementsByClassName('side-panel style-scope ytmusic-player-page');
                elements.playlist = playlistFinder[0];

                // Injecting animations for background and clock gradients
                injectStyle(keyframes);

                setupVisualizer();

                // Note: Everything below used to be timed out, now this whole setup function is timed out for safety lol
                // If shit breaks just put back everything below in a timeout
                try {
                    const guides = await document.getElementsByTagName('ytmusic-guide-section-renderer');
                    elements.bigGuide = guides[0].children[2];
                    elements.miniGuide = guides[2].children[2];
                }
                catch {
                    if(!elements.miniGuide) console.warn('Could not find miniGuide!');
                }

                // Adds a settings button on the navbar
                createCogFrame();

                // Iterate through toCallOnEvents
                for(const fn in toCallOnEvents) {
                    try {
                        toCallOnEvents[fn](ytmpConfig.get(fn));
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
                console.log('ytmPlus: Setup finished.');
            }
            catch (error) {
                console.error(error);
            }
        }

        function changeShortcut() {
        // Create overlay window
            window.removeEventListener('keydown', keydownEvent);
            const shortcutWindow = injectElement('div', 'shortcutWindow', document.body);
            const shortcutText = injectElement('div', 'shortcutText', shortcutWindow);
            const prompt = 'Press the buttons you would like to use,\nor press Escape to close this window.';
            shortcutText.innerText = prompt;
            const buttonHolder = injectElement('div', 'shortcutButtonHolder', shortcutWindow);
            const saveButton = injectElement('input', 'saveShortcut', buttonHolder);
            saveButton.type = 'button';
            saveButton.value = 'Save';
            saveButton.addEventListener('click', saveShortcut);
            const resetButton = injectElement('input', 'resetShortcut', buttonHolder);
            resetButton.type = 'button';
            resetButton.value = 'Reset';
            resetButton.addEventListener('click', resetShortcut);
            const quitButton = injectElement('input', 'quitShortcut', buttonHolder);
            quitButton.type = 'button';
            quitButton.value = 'Quit';
            quitButton.addEventListener('click', quitShortcut);

            let lastPressedKey, fancyKey;
            window.addEventListener('keydown', handleKeystrokes);

            shortcutWindow.click();

            function handleKeystrokes(e) {
                if(e.key === 'Escape') return quitShortcut();

                if((e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt') === false) lastPressedKey = e; // If it's not a modifier key, save it
                else return;
                fancyKey = (e.ctrlKey ? 'CTRL + ' : '') + (e.shiftKey ? 'SHIFT + ' : '') + (e.altKey ? 'ALT + ' : '') + e.key;
                shortcutText.innerText = fancyKey;
            }
            function saveShortcut() {
                if(!lastPressedKey) {
                    shortcutText.animate({
                        marginLeft: ['0', '2%', '-2%', '0'],
                        color: ['red', 'white'],
                        easing: 'linear'
                    }, 250);
                    return;
                }
                const shortcutValue = (lastPressedKey.ctrlKey ? 'ctrl ' : '') +
                        (lastPressedKey.shiftKey ? 'shift ' : '') +
                        (lastPressedKey.altKey ? 'alt ' : '') +
                        (lastPressedKey.code ? lastPressedKey.code : '') +
                        '|' + fancyKey;
                ytmpConfig.set('shortcut', shortcutValue);
                ytmpConfig.save();
                shortcutText.innerText = 'Saved!\nPress Escape to close this window.';
            }
            function resetShortcut() {
                lastPressedKey = undefined;
                shortcutText.innerText = prompt;
            }
            function quitShortcut() {
                window.removeEventListener('keydown', handleKeystrokes);
                window.addEventListener('keydown', keydownEvent);
                return shortcutWindow.remove();
            }
        }

        async function createResetWarning(frame, resetLink) {
        // Creating window that pops up if you press reset
            const resetWarning = await injectElement('div', 'reset_warning', frame, undefined, 'display: none');
            const warningText = await injectElement('span', 'warning_text', resetWarning);
            warningText.innerText = 'WAIT!\nRESET EVERYTHING TO DEFAULT?';
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
            const sideBySide = await injectElement('div', 'sideBySide', wrapper);
            const categorySelect = await injectElement('div', 'categorySelect', sideBySide);

            // Get all categories and make category names into buttons
            const categories = document.getElementsByClassName('section_header_holder');
            for(let i = 0, len = categories.length - 1; i < len; i++) {
                const sectionName = categories[i].children[0].innerHTML;

                const newCategoryButton = await injectElement('input', undefined, categorySelect, 'changeCategoryButton');
                newCategoryButton.type = 'button';
                newCategoryButton.value = sectionName;
            }

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

            await injectElement('div', 'ytmpDivider', sideBySide);

            const currentSettings = await injectElement('div', 'currentSettings', sideBySide);
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
            // indeed, lastOpenCategory is string, did you know you can use a string for an array's index?
            if(ytmpConfig.get('lastOpenCategory') !== '-1') changeCategoryButton[ytmpConfig.get('lastOpenCategory')].click();

            return resetLink;
        }

        function sortSubs() {
            for(const field in ytmpConfig.fields) {
                const currentField = ytmpConfig.fields[field];

                let sub = currentField.settings.subCheckbox || currentField.settings.subOption;
                if(!sub) continue;

                const currentLabel = currentField.wrapper.firstElementChild;
                currentLabel.style.paddingLeft = '5%';
                currentLabel.style.width = '65%';

                let selectOption;
                sub = sub.split('.');
                const subToggle = ytmpConfig.fields[sub[0]];
                if(sub.length === 2) selectOption = parseInt(sub[1], 10);

                if(subToggle.settings.type === 'checkbox') {
                    if(subToggle.value === true) currentField.wrapper.style.display = 'flex';
                    else currentField.wrapper.style.display = 'none';
                    subToggle.node.addEventListener('change', e => {
                        if(e.target.checked === true) currentField.wrapper.style.display = 'flex';
                        else currentField.wrapper.style.display = 'none';
                    });
                }
                else if(subToggle.settings.type === 'select') {
                    if(subToggle.node.selectedIndex === selectOption) currentField.wrapper.style.display = 'flex';
                    else currentField.wrapper.style.display = 'none';
                    subToggle.node.addEventListener('change', e => {
                        if(e.target.selectedIndex === selectOption) currentField.wrapper.style.display = 'flex';
                        else currentField.wrapper.style.display = 'none';
                    });
                }
            }
        }

        function dragElement(elmnt, frame) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            elmnt.addEventListener('mousedown', dragMouseDown);

            function dragMouseDown(e) {
                frame.style.transition = '0s';
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
                frame.style.transition = '0.1s';
                fixPlacement(frame);
            }
        }

        function fixPlacement(frame) {
        // If frame is out of bounds, move it back in
            if(frame.offsetTop < 0) frame.style.top = '0px';
            if(frame.offsetLeft < 0) frame.style.left = '0px';
            if(frame.offsetTop > window.innerHeight - frame.offsetHeight) frame.style.top = (window.innerHeight - frame.offsetHeight) + 'px';
            if(frame.offsetLeft > window.innerWidth - frame.offsetWidth) frame.style.left = (window.innerWidth - frame.offsetWidth) + 'px';

            // If frame is too big to fit on the screen, move it to the top left corner
            if(frame.offsetHeight > window.innerHeight) frame.style.top = '0px';
            if(frame.offsetWidth > window.innerWidth) frame.style.left = '0px';
        }

        function expandOrShrink(frame, hideCategoriesBtn) {
            if(!ytmpConfig.shrunk) hideThem(frame, hideCategoriesBtn);
            else showThem(frame, hideCategoriesBtn);
        }

        function hideThem(frame, hideCategoriesBtn) {
            document.getElementById('categorySelect').style.display = 'none';
            document.getElementById('ytmpDivider').style.display = 'none';
            document.getElementById('currentSettings').style.width = '100%';
            frame.style.aspectRatio = '2.4 / 3';
            ytmpConfig.shrunk = true;
            hideCategoriesBtn.value = '<<';
        }

        function showThem(frame, hideCategoriesBtn) {
            document.getElementById('categorySelect').style.display = 'flex';
            document.getElementById('ytmpDivider').style.display = 'flex';
            document.getElementById('currentSettings').style.width = '60%';
            frame.style.aspectRatio = '4 / 3';
            ytmpConfig.shrunk = false;
            hideCategoriesBtn.value = '>>';
            setTimeout(() => fixPlacement(frame), 110); // we need to wait for transition to finish which is 100ms plud leeway
        }

        async function createTitlebar(wrapper, frame) {
        // Creating titlebar
            const titlebar = await injectElement('div', 'ytmPlusCfg_titlebar', wrapper, undefined, undefined, true);
            const closeButton = await injectElement('input', 'titlebar_x', titlebar, 'titlebarButtons');
            closeButton.type = 'button';
            closeButton.value = '✕';
            closeButton.addEventListener('click', () => {
                ytmpConfig.close();
                ytmpConfig.shrunk = false;
            });

            // Support button
            const kofi = await injectElement('div', 'supportMePls', titlebar, 'titlebarButtons');
            const kofiA = await injectElement('a', 'goToKofi', kofi);
            kofiA.innerHTML = '<img src="https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/61e111774d3a2f67c827cd25_Frame%205.png">';
            kofiA.href = 'https://ko-fi.com/realmariod';
            kofiA.title = 'Buy me a Coffee!';
            kofiA.target = '_blank';

            // Hide categories button
            const hideCategoriesBtn = await injectElement('input', 'hideCategories', titlebar, 'titlebarButtons');
            hideCategoriesBtn.type = 'button';
            hideCategoriesBtn.value = '>>';
            hideCategoriesBtn.addEventListener('click', () => expandOrShrink(frame, hideCategoriesBtn));

            // Adding draggable part to titlebar now so that you can actually click X and support
            const draggablePart = await injectElement('div', 'titlebar_draggable', titlebar);
            const titlebarIcon = await injectElement('img', 'titlebar_icon', draggablePart);
            titlebarIcon.src = 'https://i.imgur.com/gfg6VLJ.png';
            const titlebarTitle = await injectElement('span', 'titlebar_title', draggablePart);
            // eslint-disable-next-line no-undef
            titlebarTitle.innerHTML = `ytmPlus ${vNumber}`;
            dragElement(draggablePart, frame);
        }

        const headerSVG = '<svg id="header_svg">\r\n    <g style="overflow:hidden; text-anchor: middle;">\r\n        <defs>\r\n            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">\r\n                <feGaussianBlur stdDeviation="5" result="glow"/>\r\n                <feMerge>\r\n                <feMergeNode in="glow"/>\r\n                <feMergeNode in="glow"/>\r\n                <feMergeNode in="glow"/>\r\n                </feMerge>\r\n            </filter>\r\n        </defs>\r\n        <text x="50%" y="50%" dy=".35em" text-anchor="middle">YTMPlus</text>\r\n        <a href="https://github.com/RealMarioD/ytmplus" target="_blank"><text style="filter: url(#glow);" x="50%" y="50%" dy=".35em" text-anchor="middle">YTMPlus</text></a>\r\n    </g>\r\n</svg>';

        async function manageUI(frame) {
            frame.style.overflow = 'hidden';
            frame.style.aspectRatio = '4 / 3';
            frame.style.removeProperty('width');
            frame.style.removeProperty('height');
            frame.style.removeProperty('max-width');
            frame.style.removeProperty('max-height');
            frame.style.inset = '44px 0px 0px 440px';

            const wrapper = document.getElementById('ytmPlusCfg_wrapper');

            // Header title svg
            const title = document.getElementById('ytmPlusCfg_header');
            title.innerHTML = headerSVG;
            const vnumberHeader = injectElement('span', 'vnumber_header', title);
            // eslint-disable-next-line no-undef
            vnumberHeader.innerHTML = vNumber; // vNumber hacked in with metadataBuilder

            const resetLink = await sortOutCategories(wrapper);

            sortSubs();

            createTitlebar(wrapper, frame);

            createResetWarning(frame, resetLink);
        }

        function setupAutosave() {
        // Autosave for input tags + Adding info to int/float settings
            const inputs = document.getElementsByTagName('input');
            for(let i = 0; i < inputs.length; i++) {
                inputs[i].addEventListener('change', () => ytmpConfig.save());
                if(!isNaN(parseInt(inputs[i].value, 10))) {
                    const fieldSettings = ytmpConfig.fields[inputs[i].id.split('_')[2]].settings;
                    inputs[i].title = `type: ${fieldSettings.type} | default: ${fieldSettings.default} | ${fieldSettings.min} . . ${fieldSettings.max}`;
                }
            }
            // Autosave for select tags
            const selects = document.getElementsByTagName('select');
            for(let i = 0; i < selects.length; i++) selects[i].addEventListener('change', () => ytmpConfig.save());

            // Autosave for textarea tags + adjustments for full width
            const textareas = document.getElementsByTagName('textarea');
            for(let i = 0; i < textareas.length; i++) {
                textareas[i].parentElement.style.alignItems = 'stretch';
                textareas[i].previousSibling.style.padding = 0;
                textareas[i].addEventListener('change', () => ytmpConfig.save());
            }
        }

        function openEvent(doc, win, frame) { // open function is mostly customizing settings UI
        // Quick hack for color fields
            for(const key in configFields) {
                if(configFields[key].type !== 'color') continue;
                document.getElementById(`ytmPlusCfg_field_${key}`).type = 'color';
                if(key === 'changeShortcut') configFields[key].label += ytmpConfig.get('shortcut').split('|')[1];
                ytmpConfig.fields[key].node.selectIndex = ytmpConfig.get(key);
            }

            console.log(ytmpConfig);

            manageUI(frame);

            setupAutosave();

            // gmconfig probably does frame.style = {} onOpen or some other fuckery, so we say fuck you and reapply
            changeWindowSize(ytmpConfig.get('changeWindowSize'));
            // surely there is a better way to do this, but this is seems better than the better way, i better be right xdx im so funny

            setTimeout(() => {
                ytmpConfig.frame.style.transition = '0.1s';
                fixPlacement(frame);
            }, 100);
        }

        function closeEvent() {
            ytmpConfig.frame.style.transition = '0s';
        }

        function saveEvent() {
        // Updates updateable stuff on save
            for(const fn in toCallOnEvents) {
                try {
                    toCallOnEvents[fn](ytmpConfig.get(fn));
                }
                catch (error) {
                    console.error(error);
                }
            }

            startVisualizer();

            window.dispatchEvent(new Event('resize'));
        }

        ytmpConfig.onOpen = openEvent;
        ytmpConfig.onSave = saveEvent;
        ytmpConfig.onClose = closeEvent;

        configFields.changeShortcut.click = changeShortcut;

        window.addEventListener('keydown', keydownEvent);

        window.addEventListener('load', () => setTimeout(setup, 500));
    })();
}
catch (err) {
    console.error(err);
}
