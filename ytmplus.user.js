// ==UserScript==
// @name         ytmPlus
// @namespace    http://tampermonkey.net/
// @version      1.8.0
// @updateURL    https://github.com/RealMarioD/ytmplus/raw/main/ytmplus.user.js
// @downloadURL  https://github.com/RealMarioD/ytmplus/raw/main/ytmplus.user.js
// @description  Ever wanted some nice addons for YouTube Music? If yes, you are at the right place.
// @author       Mario_D#7052
// @match        https://music.youtube.com/*
// @icon         https://imgur.com/gfg6VLJ.png
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // Some global variables
    let open = false; // Used to track if config window is open or not
    let playerPageDiv; // Set to the player "overlay" in window.onload
    let upgradeText; // Set to the upgrade "button" in window.onload
    let clockFunction; // Holds the interval function that updates the digital clock
    let noAfkFunction; // Holds the anti-afk interval function
    let noPromoFunction; // Holds the no promotions function
    let skipDislikedFunction; // Holds the skip disliked songs function
    let dumbFix = 0; // idek what to type here, DOMSubtreeModified fires twice, this helps code run only once lmao
    let navBarBg; // Holds the navbar bg's div, visualizer canvas is injected into its innerHTML
    let mainPanel; // Holds something from around the album cover, - - | | - -
    const visualizer = {
        place: undefined,
        startsFrom: undefined,
        color: undefined,
        fade: undefined,
        rotate: undefined,
        rotateDirection: undefined,
        move: undefined,
        cutOff: 0.1625,
        bassBounce: {
            enabled: null,
            sensitivityStart: null,
            sensitivityEnd: null,
            debug: null
        },
        analyser: undefined,
        bufferLength: null,
        dataArray: null,
        getBufferData() {
            this.analyser.fftSize = GM_config.get('visualizerFft');
            this.bufferLength = this.analyser.frequencyBinCount - Math.floor(this.analyser.frequencyBinCount * this.cutOff); // We cut off the end because data is 0, making visualizer's end flat
            this.dataArray = new Uint8Array(this.bufferLength);
        },
        initValues() {
            for(const key in this) {
                if(Object.hasOwnProperty.call(this, key)) {
                    let gmName = `visualizer${key[0].toUpperCase()}${key.slice(1, key.length)}`;
                    if(typeof this[key] == 'object') {
                        for(const key2 in this[key]) {
                            if(Object.hasOwnProperty.call(this[key], key2)) {
                                gmName = `visualizer${key[0].toUpperCase() + key.slice(1, key.length) + key2[0].toUpperCase() + key2.slice(1, key2.length)}`;
                                this[key][key2] = GM_config.get(gmName);
                            }
                        }
                        if(this.analyser !== undefined) {
                            this.analyser.smoothingTimeConstant = GM_config.get('visualizerSmoothing');
                            this.analyser.minDecibels = GM_config.get('visualizerMinDecibels');
                            this.analyser.maxDecibels = GM_config.get('visualizerMaxDecibels');
                        }
                        return;
                    }
                    else this[key] = GM_config.get(gmName);
                }
            }
        }

    };

    // 'type': 'color'; just results in a text input, they are later converted to actual color input, see open event (because GM_config wiki over-fucking-engineered the custom field type stuff so i dont really understand it and cba to set it up correctly)
    // eslint-disable-next-line no-undef
    const GM_config = new GM_configStruct({
        'id': 'ytmPlusCfg',
        'title': 'ytmPlus',
        'description': 'Testing',
        'fields': {
            'noAfk': {
                'label': 'Never AFK',
                'section': 'Utilities',
                'type': 'checkbox',
                'default': true
            },
            'noPromo': {
                'label': 'No Promotions',
                'type': 'checkbox',
                'default': true
            },
            'skipDisliked': {
                'label': 'Skip Disliked Songs (Beta)',
                'type': 'checkbox',
                'default': false
            },
            'padding': {
                'label': 'Change Padding (Refresh for changes)',
                'type': 'checkbox',
                'default': true
            },
            'extraButtons': {
                'label': 'Extra Playback Buttons',
                'type': 'checkbox',
                'default': true
            },
            'section0': {
                'type': 'hidden',
                'value': 'open',
                'default': 'open'
            },
            'bg': {
                'label': 'Change Background',
                'section': 'Background Settings',
                'type': 'checkbox',
                'default': true
            },
            'bgColor': {
                'label': 'Background Color',
                'type': 'color',
                'default': '#AA0000'
            },
            'bgEnableGradient': {
                'label': 'Enable Gradient',
                'type': 'checkbox',
                'default': true
            },
            'bgGradient': {
                'label': 'Background Gradient Color',
                'type': 'color',
                'default': '#0000AA'
            },
            'section1': {
                'type': 'hidden',
                'value': 'open',
                'default': 'open'
            },
            'clock': {
                'label': 'Change "Upgrade" Button',
                'section': 'Upgrade Button',
                'type': 'select',
                'options': ['Original', 'Remove Button', 'Digital Clock'],
                'default': 'Digital Clock'
            },
            'clockColor': {
                'label': 'Clock Color',
                'type': 'color',
                'default': '#AA3333'
            },
            'clockGradient': {
                'label': 'Enable Gradient',
                'type': 'checkbox',
                'default': true
            },
            'clockGradientColor': {
                'label': 'Gradient Color',
                'type': 'color',
                'default': '#3333AA'
            },
            'section2': {
                'type': 'hidden',
                'value': 'open',
                'default': 'open'
            },
            'visualizerPlace': {
                'label': 'Visualizer Place',
                'section': 'Music Visualizer',
                'type': 'select',
                'options': ['Disabled', 'Navbar', 'Album Cover'],
                'default': 'Album Cover'
            },
            'visualizerStartsFrom': {
                'label': 'Visualizer Starts from',
                'type': 'select',
                'options': ['Left', 'Center', 'Right', 'Edges'],
                'default': 'Center'
            },
            'visualizerColor': {
                'label': 'Visualizer Color',
                'type': 'color',
                'default': '#8C008C'
            },
            'visualizerFade': {
                'label': 'Enable Bar Fade',
                'type': 'checkbox',
                'default': false
            },
            'visualizerFft': {
                'label': 'Bar Amount',
                'type': 'select',
                'options': ['32', '64', '128', '256', '512', '1024', '2048', '4096', '8192', '16384'],
                'default': '1024',
            },
            'attention0': {
                'label': 'High values affect performance and<br>can break circle visualizer.',
                'type': 'hidden'
            },
            'section3': {
                'type': 'hidden',
                'value': 'open',
                'default': 'open'
            },
            'visualizerRotate': {
                'label': 'Rotate Circle Vis.',
                'section': 'Circle Visualizer',
                'type': 'select',
                'options': ['Disabled', 'On', 'Reactive', 'Reactive (Bass)'],
                'default': 'Disabled'
            },
            'visualizerRotateDirection': {
                'label': 'Rotation Direction',
                'type': 'select',
                'options': ['Clockwise', 'Counter-Clockwise'],
                'default': 'Clockwise'
            },
            'visualizerMove': {
                'label': 'Bars Move',
                'type': 'select',
                'options': ['Inside', 'Outside', 'Both Sides'],
                'default': 'Both Sides'
            },
            'visualizerBassBounceEnabled': {
                'label': 'Bass Bounce',
                'type': 'checkbox',
                'default': true
            },
            'section4': {
                'type': 'hidden',
                'value': 'open',
                'default': 'open'
            },
            'attention1': {
                'label': 'Changes here can cause glitches!',
                'section': 'Advanced Visualizer Settings',
                'type': 'hidden'
            },
            'visualizerMinDecibels': {
                'label': 'Min Decibels',
                'type': 'int',
                'min': -100,
                'max': 0,
                'default': -85
            },
            'visualizerMaxDecibels': {
                'label': 'Max Decibels',
                'type': 'int',
                'min': -100,
                'max': 0,
                'default': 0
            },
            'visualizerSmoothing': {
                'label': 'Smoothing Time Constant',
                'type': 'float',
                'min': 0.0,
                'max': 1.0,
                'default': 0.5
            },
            'visualizerCutOff': {
                'label': 'AudioData End Cutoff',
                'type': 'float',
                'min': 0,
                'max': 0.9999,
                'default': 0.1625
            },
            'visualizerBassBounceSensitivityStart': {
                'label': 'Bass Bounce Sensitivity Start',
                'type': 'float',
                'min': 0,
                'max': 1,
                'default': 0
            },
            'visualizerBassBounceSensitivityEnd': {
                'label': 'Bass Bounce Sensitivity End',
                'type': 'float',
                'min': 0.00001,
                'max': 1,
                'default': 0.004
            },
            'visualizerBassBounceDebug': {
                'label': 'Bass Bounce Debug Color',
                'type': 'checkbox',
                'default': false
            },
            'section5': {
                'type': 'hidden',
                'value': 'closed',
                'default': 'closed'
            }
        },
        'css':
            `input[type="color"] {
	            -webkit-appearance: none;
	            border: 0;
                padding: 0;
	            width: 2.5vh;
	            height: 2.5vh;
            }
            input[type="color"]::-webkit-color-swatch-wrapper {
	            padding: 0;
            }
            input[type="color"]::-webkit-color-swatch {
	            border: 0;
            }
            input[type="color"], input[type="checkbox"] {
                width: 2vh;
                height: 2vh;
            }
            input[type="text"] {
                width: 8vh;
            }
            input {
                vertical-align: middle;
                background-color: rgba(66, 66, 66, 0.8);
                font-size: 2vh;
            }
            #ytmPlusCfg .config_var {
                margin: 0 0 0.5vh;
                text-align: center;
            }
            #ytmPlusCfg * {
                font-family: monospace;
                color: rgba(255, 255, 255, 0.8);
            }
            #ytmPlusCfg {
                background-color: rgba(0, 0, 0, 0.9);
            }
            #ytmPlusCfg #ytmPlusCfg_header {
                font-size: 7vh;
                background: -webkit-linear-gradient(-45deg, rgb(170, 25, 25), rgb(25, 25, 170));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin: 0.5vh 0;
            }
            #ytmPlusCfg .section_header_holder {
                margin-top: 0;
            }
            #ytmPlusCfg .section_header {
                margin-bottom: 0.5vh;
                font-size: 2.5vh;
            }
            #ytmPlusCfg .field_label {
                font-size: 2.5vh;
                vertical-align: middle;
            }
            #ytmPlusCfg select {
                vertical-align: middle;
                background-color: rgba(66, 66, 66, 0.8);
                font-size: 2vh;
            }
            #ytmPlusCfg .reset {
                color: rgba(255, 255, 255, 0.8);
            }
            ::-webkit-scrollbar {
                width: 2vw;
            }
            ::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 2vw;
            }
            ::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 2vw;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
            svg text {
                font-size: 17vw;
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
                overflow-y: overlay;
                max-height: 80vh;
                display: block;
            }`,
        'events': {
            'open': (doc, win, frame) => { // open function is mostly customizing settings UI
                doc.body.style.overflow = 'hidden';
                frame.style.width = '25vw';
                // frame.style.height = // '80vh';
                frame.style.maxHeight = '85vh';
                frame.style.display = 'block';
                frame.style.margin = 'auto';
                frame.style.inset = '0';
                frame.style.boxShadow = '20px 20px 40px rgba(10, 10, 10, 0.8)';
                frame.style.border = '';
                frame.style.borderRadius = '1.5vw';

                const buttons = doc.getElementById('ytmPlusCfg_buttons_holder');
                buttons.style.textAlign = 'center';
                for(let i = 0; i < buttons.children.length; i++) {
                    const e = buttons.children[i];
                    if(i + 1 != buttons.children.length) {
                        e.style.verticalAlign = 'middle';
                        e.style.backgroundColor = 'rgba(66, 66, 66, 0.8)';
                        e.style.fontSize = '2vh';
                    }
                    else e.firstChild.style.fontSize = '2vh';
                    e.style.margin = '0.5vh';
                }

                // Every color input we want has to be changed here (customType would come in handy but how the hell do it work)
                doc.getElementById('ytmPlusCfg_field_bgColor').type = 'color';
                doc.getElementById('ytmPlusCfg_field_bgGradient').type = 'color';
                doc.getElementById('ytmPlusCfg_field_clockColor').type = 'color';
                doc.getElementById('ytmPlusCfg_field_clockGradientColor').type = 'color';
                doc.getElementById('ytmPlusCfg_field_visualizerColor').type = 'color';

                // Putting the sections and settings into a scrollable div, so that the whole window won't become scrollable
                const node = doc.createElement('div');
                node.id = 'cfgHolder';
                const wrapper = doc.getElementById('ytmPlusCfg_wrapper');
                wrapper.appendChild(node);
                for(let i = 0; i <= wrapper.childNodes.length + 1; i++) node.appendChild(wrapper.childNodes[1]); // Not sure how this works, but I somehow skip the header and the buttons at the end
                wrapper.appendChild(wrapper.childNodes[1]);

                // Live change + Adding info to advanced visualizer settings
                const inputs = doc.getElementsByTagName('input');
                for(let i = 0; i < inputs.length; i++) {
                    inputs[i].addEventListener('change', () => GM_config.save());
                    if(!isNaN(parseInt(inputs[i].value))) {
                        const fieldSettings = GM_config.fields[inputs[i].id.split('_')[2]].settings;
                        inputs[i].title = `type: ${fieldSettings.type} | default: ${fieldSettings.default} | ${fieldSettings.min} . . ${fieldSettings.max}`;
                    }
                }
                const selects = doc.getElementsByTagName('select');
                for(let i = 0; i < selects.length; i++) selects[i].addEventListener('change', () => GM_config.save());

                // Header title svg
                const title = doc.getElementById('ytmPlusCfg_header');
                title.innerHTML = `
                <svg viewBox="0 0 613 99">
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

                // Handles opening/closing categories
                const categories = doc.getElementsByClassName('section_header_holder');
                for(let i = 0; i < categories.length; i++) {
                    categories[i].style.overflowY = 'hidden';
                    if(GM_config.get(`section${i}`) == 'open') {
                        categories[i].children[0].innerHTML = '▲ ' + categories[i].children[0].innerHTML + ' ▲';
                        categories[i].style.height = 'auto';
                    }
                    else if(GM_config.get(`section${i}`) == 'closed') {
                        categories[i].children[0].innerHTML = '▼ ' + categories[i].children[0].innerHTML + ' ▼';
                        categories[i].style.height = '3.25vh';
                    }

                    categories[i].children[0].addEventListener('click', () => {
                        if(GM_config.get(`section${i}`) == 'closed') {
                            categories[i].style.height = 'auto';
                            categories[i].children[0].innerHTML = categories[i].children[0].innerHTML.replaceAll(/▼/g, '▲');
                            GM_config.set(`section${i}`, 'open');
                            GM_config.save();
                        }
                        else if(GM_config.get(`section${i}`) == 'open') {
                            categories[i].style.height = '3.25vh';
                            categories[i].children[0].innerHTML = categories[i].children[0].innerHTML.replaceAll(/▲/g, '▼');
                            GM_config.set(`section${i}`, 'closed');
                            GM_config.save();
                        }
                    });
                }

                doc.addEventListener('keydown', event => {
                    if(event.key == 'Escape') GM_config.close();
                });

                open = true;
            },
            'close': () => {
                open = false;
            },
            'save': () => {
                // Updates updateable stuff on save
                if(GM_config.get('bg') == false) {
                    document.body.style.backgroundColor = '#000000';
                    document.body.style.backgroundImage = '';
                    playerPageDiv.style.backgroundColor = '#000000';
                    playerPageDiv.style.backgroundImage = '';
                }
                else {
                    try {
                        document.getElementsByClassName('immersive-background style-scope ytmusic-browse-response')[0].children[0].remove();
                    }
                    catch { }
                    document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';
                    addFancy(document.body.style, true);
                    addFancy(playerPageDiv.style);
                }

                clockEnable(GM_config.get('clock'));

                afkEnable(GM_config.get('noAfk'));

                promoEnable(GM_config.get('noPromo'));

                skipDisliked(GM_config.get('skipDisliked'));

                extraButtons(GM_config.get('extraButtons'));

                if(GM_config.get('visualizerPlace') != 'Disabled') {
                    if(visualizer.analyser === undefined) getVideo();
                    else {
                        visualizer.initValues();
                        visualizer.getBufferData();
                    }
                }
                window.dispatchEvent(new Event('resize'));
            }
        }
    });

    // Code that opens/closes settings UI
    window.addEventListener('keydown', (ev) => {
        if(ev.code == 'Backslash' && ev.ctrlKey == true) {
            if(open === false) {
                GM_config.open();
                open = true;
            }
            else {
                GM_config.close();
                open = false;
            }
        }
    });

    window.addEventListener('load', () => {
        // Creating bg movement animation by injecting css into head
        upgradeText = document.getElementsByClassName('tab-title style-scope ytmusic-pivot-bar-item-renderer')[3];
        const animation = `@keyframes gradient {
			0% {
				background-position: 0% 50%;
			}

			100% {
				background-position: 100% 50%;
			}
		}
        @keyframes effect {
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

        playerPageDiv = document.getElementsByClassName('content style-scope ytmusic-player-page')[0];
        navBarBg = document.getElementById('nav-bar-background');

        // Checking whether functions are turned on, enabling them if yes
        promoEnable(GM_config.get('noPromo'));

        afkEnable(GM_config.get('noAfk')); // Credit to q1k - https://greasyfork.org/en/users/1262-q1k

        if(GM_config.get('bg') == true) {
            // Remove weird bg gradient div stuff that ytm added early december 2022
            document.getElementsByTagName('ytmusic-browse-response')[0].children[0].remove();
            document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';

            addFancy(document.body.style, true);
            addFancy(playerPageDiv.style);
        }

        mainPanel = document.getElementById('main-panel');

        // Tries to removes weird padding
        if(GM_config.get('padding') == true) {
            playerPageDiv.style.paddingTop = '0px';
            mainPanel.style.marginTop = '8vh';
            mainPanel.style.marginBottom = '8vh';
        }

        clockEnable(GM_config.get('clock'));

        // Injecting canvas
        navBarBg.innerHTML = '<canvas id="visualizerNavbarCanvas" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;"></canvas>';
        navBarBg.style.opacity = 1;
        mainPanel.innerHTML += '<canvas id="visualizerAlbumCoverCanvas" style="position: absolute; z-index: 9999; pointer-events: none"></canvas>';
        if(GM_config.get('visualizerPlace') != 'Disabled') getVideo();

        skipDisliked(GM_config.get('skipDisliked'));

        extraButtons(GM_config.get('extraButtons'));

        // Adds a settings button on the navbar
        node = document.createElement('iframe');
        node.id = 'ytmPSettings';
        node.src = 'about:blank';
        node.style = 'top: 7px; left: 100px; height: 50px; opacity: 1; overflow: auto; padding: 0px; position: fixed; width: 50px; z-index: 9999; overflow: hidden;';
        document.body.appendChild(node);
        const frameDoc = document.getElementById('ytmPSettings').contentWindow.document;
        // I just stole the svg to youtube's settings logo so i ended up with this, sorry not sorry
        frameDoc.body.innerHTML = '<svg id="openSettings" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="display: block; width: 100%; height: 100%; fill: white;"><g class="style-scope yt-icon"><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11 l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11 l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51L13.22,21h-2.44l-0.55-2.2l-0.13-0.51 l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59l0.37-0.36l-0.08-0.51 C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62l0.5,0.14l0.4-0.32 C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14L4.34,5.27l-2,3.46 l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83c0.6,0.48,1.27,0.87,2,1.14L10,22h4 l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13 l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z" class="style-scope yt-icon"></path></g></svg>';
        frameDoc.getElementById('openSettings').addEventListener('click', () => {
            if(open == false) {
                GM_config.open();
                open = true;
            }
            else {
                GM_config.close();
                open = false;
            }
        });
    });

    let popup;
    function promoEnable(turnOn) {
        if(!turnOn) clearInterval(noPromoFunction);
        else {
            clearInterval(noPromoFunction);
            noPromoFunction = setInterval(() => {
                popup = document.getElementsByTagName('ytmusic-mealbar-promo-renderer');
                if(popup.length > 0) {
                    popup[0].remove();
                    console.log('ytmPlus: Removed a promotion.');
                }
            }, 1000);
        }
    }

    function afkEnable(turnOn) {
        if(!turnOn) clearInterval(noAfkFunction);
        else {
            clearInterval(noAfkFunction);
            noAfkFunction = setInterval(() => {
                document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 }));
                console.log('ytmPlus: Nudged the page so user is not AFK.');
            }, 15000);
        }
    }

    let currentTime;
    function clockEnable(mode) {
        if(mode == 'Original') {
            clearInterval(clockFunction);
            upgradeText.textContent = 'Upgrade';
            upgradeText.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
        }
        else if(mode == 'Digital Clock') {
            clearInterval(clockFunction);
            clockFunction = setInterval(() => {
                currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                upgradeText.textContent = currentTime;
            }, 1000);
            upgradeText.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
        }
        else {
            clearInterval(clockFunction);
            upgradeText.textContent = '';
            upgradeText.parentElement.style.margin = '0px';
        }
        const a = upgradeText.style;
        a.background = mode != 'Digital Clock' ? '' : `linear-gradient(to right, ${GM_config.get('clockColor')} 0%, ${GM_config.get('clockGradient') == true ? GM_config.get('clockGradientColor') : GM_config.get('clockColor')} 50%, ${GM_config.get('clockColor')} 100%`;
        a.backgroundSize = mode != 'Digital Clock' ? '' : '200% auto';
        a.backgroundClip = mode != 'Digital Clock' ? '' : 'text';
        a.textFillColor = mode != 'Digital Clock' ? '' : 'transparent';
        a.webkitBackgroundClip = mode != 'Digital Clock' ? '' : 'text';
        a.webkitTextFillColor = mode != 'Digital Clock' ? '' : 'transparent';
        a.fontSize = mode != 'Digital Clock' ? '20px' : '50px';
        a.animation = mode != 'Digital Clock' ? '' : 'effect 2s linear infinite normal';
    }

    function addFancy(e, overflowOn) {
        e.backgroundImage = `linear-gradient(45deg, ${GM_config.get('bgColor')}, ${GM_config.get('bgEnableGradient') == true ? GM_config.get('bgGradient') : GM_config.get('bgColor')})`;
        e.animation = 'gradient 5s linear infinite alternate';
        e.backgroundSize = '150% 150%';
        e.backgroundAttachment = 'fixed';
        // e.height = '100vh';
        if(!overflowOn) e.overflow = 'hidden';
    }

    function checkDislike() {
        if(dumbFix == 0) return dumbFix++;
        clearTimeout(skipDislikedFunction);
        skipDislikedFunction = setTimeout(() => {
            if(document.getElementById('like-button-renderer').children[0].ariaPressed == 'true') document.getElementsByClassName('next-button style-scope ytmusic-player-bar')[0].click();
        }, 5000);
        dumbFix = 0;
    }

    function skipDisliked(turnOn) {
        const titleHolder = document.getElementsByClassName('title style-scope ytmusic-player-bar')[0];
        if(!turnOn) return titleHolder.removeEventListener('DOMSubtreeModified', checkDislike, false);
        titleHolder.removeEventListener('DOMSubtreeModified', checkDislike, false);
        titleHolder.addEventListener('DOMSubtreeModified', checkDislike, false);
    }

    function extraButtons(turnOn) {
        const playbackButtons = document.getElementsByClassName('left-controls-buttons style-scope ytmusic-player-bar')[0].children;
        if(!turnOn) {
            playbackButtons[1].hidden = true;
            playbackButtons[4].hidden = true;
            return;
        }
        playbackButtons[1].hidden = false;
        playbackButtons[4].hidden = false;
    }
    /**
     * Place new functions above this comment, so visualizer code is secluded
     */
    let video;
    function getVideo() {
        video = document.querySelector('video');
        if(video) startVisualizer();
        else {
            console.warn('ytmPlus: Query "video" not found, retrying in 100ms.');
            setTimeout(() => { getVideo(); }, 100);
        }
    }

    function startVisualizer() {
        const player = document.getElementById('player');
        const context = new AudioContext();
        const src = context.createMediaElementSource(video);
        visualizer.analyser = context.createAnalyser();

        let canvas;
        let ctx;
        switch(visualizer.place) {
            case 'Navbar': default: canvas = document.getElementById('visualizerNavbarCanvas'); break;
            case 'Album Cover': canvas = document.getElementById('visualizerAlbumCoverCanvas'); break;
        }
        ctx = canvas.getContext('2d');

        src.connect(visualizer.analyser);
        visualizer.analyser.connect(context.destination);

        visualizer.initValues();
        visualizer.getBufferData();

        let WIDTH, HEIGHT = 1, xPosOffset, barTotal, barWidth, barSpace, barHeight, circleSize, radius = 1, innerRadius, outerRadius, rotationValue = 0, bass, bassSmoothRadius = 1;

        const heightModifier = () => (HEIGHT - radius) / (255 * 3);

        // Interval is mainly for album cover vis.: album cover changes size based on song (square) / video (rectangle)
        setInterval(() => {
            visualizerResizeFix();
        }, 1000);
        function visualizerResizeFix() {
            switch(visualizer.place) {
                case 'Navbar': default:
                    canvas.width = navBarBg.offsetWidth;
                    canvas.height = navBarBg.offsetHeight;
                    canvas.style.width = '';
                    canvas.style.height = '';
                    WIDTH = canvas.width;
                    HEIGHT = canvas.height;

                    if(['Center', 'Edges'].includes(visualizer.startsFrom)) barTotal = WIDTH / 2 / visualizer.bufferLength;
                    else barTotal = WIDTH / visualizer.bufferLength;
                    barSpace = barTotal * 0.05;
                    barWidth = barTotal * 0.95;
                    break;
                case 'Album Cover':
                    canvas.style.width = player.offsetWidth + 'px';
                    canvas.style.height = player.offsetHeight + 'px';
                    canvas.width = player.offsetWidth;
                    canvas.height = player.offsetHeight;
                    WIDTH = canvas.width;
                    HEIGHT = canvas.height;
                    if(!visualizer.bassBounce.enabled) radius = HEIGHT / 4;
                    break;
                case 'Disabled': break;
            }
        }

        window.addEventListener('resize', visualizerResizeFix);

        function renderFrame() {
            visualizer.analyser.getByteFrequencyData(visualizer.dataArray);

            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            switch(visualizer.place) {
                case 'Navbar': default:
                    if(canvas.id != 'visualizerNavbarCanvas') {
                        canvas = document.getElementById('visualizerNavbarCanvas');
                        ctx = canvas.getContext('2d');
                    }
                    visualizerNavbar();
                    break;
                case 'Album Cover':
                    if(canvas.id != 'visualizerAlbumCoverCanvas') {
                        canvas = document.getElementById('visualizerAlbumCoverCanvas');
                        ctx = canvas.getContext('2d');
                    }
                    visualizerCircle();
                    break;
                case 'Disabled': break;
            }

            requestAnimationFrame(renderFrame);
        }
        renderFrame();

        function visualizerNavbar() {
            switch(visualizer.startsFrom) {
                case 'Center': xPosOffset = barWidth / 2; break;
                case 'Edges': xPosOffset = barSpace / 2; break;
                default: xPosOffset = 0; break;
            }

            if(!visualizer.fade) ctx.fillStyle = visualizer.color;

            for(let i = 0; i < visualizer.bufferLength; i++) {
                barHeight = visualizer.dataArray[i] * (HEIGHT / 255);
                if(visualizer.fade) ctx.fillStyle = visualizer.color + (visualizer.dataArray[i] < 128 ? (visualizer.dataArray[i] * 2).toString(16) : 'FF');
                if(visualizer.startsFrom == 'Left') {
                    ctx.fillRect(xPosOffset, HEIGHT - barHeight, barWidth, barHeight);
                    xPosOffset += barWidth + barSpace;
                }
                else if(visualizer.startsFrom == 'Center') {
                    if(WIDTH / 2 - xPosOffset < 0 - barWidth) break;
                    ctx.fillRect(WIDTH / 2 - xPosOffset, HEIGHT - barHeight, barWidth, barHeight);
                    xPosOffset += barWidth + barSpace;
                }
                else if(visualizer.startsFrom == 'Right') {
                    ctx.fillRect(WIDTH - xPosOffset, HEIGHT - barHeight, 0 - barWidth, barHeight);
                    xPosOffset += barWidth + barSpace;
                }
                else if(visualizer.startsFrom == 'Edges') {
                    if(xPosOffset > WIDTH / 2) break;
                    ctx.fillRect(xPosOffset, HEIGHT - barHeight, barWidth, barHeight);
                    xPosOffset += barWidth + barSpace;
                }
            }

            if(visualizer.startsFrom == 'Center') xPosOffset = WIDTH / 2 + barWidth / 2 + barSpace;
            else if(visualizer.startsFrom == 'Edges') xPosOffset = barWidth + (barSpace / 2);
            else return;

            for(let i = 0; i < visualizer.bufferLength; i++) {
                barHeight = visualizer.dataArray[i] * (HEIGHT / 255);
                if(visualizer.fade) ctx.fillStyle = visualizer.color + (visualizer.dataArray[i] < 128 ? (visualizer.dataArray[i] * 2).toString(16) : 'FF');
                if(visualizer.startsFrom == 'Center') {
                    if(xPosOffset > WIDTH) break;
                    else if(i != 0) {
                        ctx.fillRect(xPosOffset, HEIGHT - barHeight, barWidth, barHeight);
                        xPosOffset += barTotal;
                    }
                }
                else if(visualizer.startsFrom == 'Edges') {
                    if(xPosOffset > WIDTH / 2) break;
                    ctx.fillRect(WIDTH - xPosOffset, HEIGHT - barHeight, barWidth, barHeight);
                    xPosOffset += barTotal;
                }
            }
        }

        function visualizerCircle() { // Bitwise truncation (~~number) is used here instead of Math.floor() to squish out more performance.
            if(visualizer.startsFrom == 'Left' || visualizer.startsFrom == 'Right') circleSize = 2; // 2PI = full, 1PI = half;
            else circleSize = 1;

            if(visualizer.bassBounce.enabled || visualizer.rotate == 'Reactive (Bass)') {
                bass = visualizer.dataArray.slice(~~(visualizer.dataArray.length * visualizer.bassBounce.sensitivityStart), ~~(visualizer.dataArray.length * visualizer.bassBounce.sensitivityEnd) + 1);
                bassSmoothRadius = ~~((bassSmoothRadius + (bass.reduce((a, b) => a + b, 0) / bass.length) / 2) / 2);
                if(visualizer.bassBounce.enabled) radius = HEIGHT / 6 + bassSmoothRadius;
            }

            switch(visualizer.rotate) {
                case 'On':
                    if(visualizer.rotateDirection == 'Clockwise') rotationValue += 0.005;
                    else rotationValue -= 0.005;
                    break;
                case 'Reactive':
                    if(visualizer.rotateDirection == 'Clockwise') rotationValue += Math.pow(visualizer.dataArray.reduce((a, b) => a + b, 0) / visualizer.bufferLength / 10000 + 1, 2) - 1;
                    else rotationValue -= Math.pow(visualizer.dataArray.reduce((a, b) => a + b, 0) / visualizer.dataArray.length / 10000 + 1, 2) - 1;
                    break;
                case 'Reactive (Bass)':
                    if(visualizer.rotateDirection == 'Clockwise') rotationValue += Math.pow(bassSmoothRadius * 2 / 10000 + 1, 2) - 1;
                    else rotationValue -= Math.pow(bassSmoothRadius * 2 / 10000 + 1, 2) - 1;
                    break;
                default: rotationValue = 0; break;
            }


            barTotal = circleSize * Math.PI / visualizer.bufferLength;
            barWidth = barTotal * 0.45;

            function drawArcs(backwards) {
                ctx.save();
                ctx.translate(WIDTH / 2, HEIGHT / 2); // move to center of circle
                ctx.rotate(-(0.5 * Math.PI) + rotationValue);

                for(let i = 0; i < visualizer.dataArray.length; ++i) {
                    ctx.fillStyle = visualizer.color + (visualizer.fade ? visualizer.dataArray[i] < 128 ? (visualizer.dataArray[i] * 2).toString(16) : 'FF' : '');
                    if(visualizer.bassBounce.debug && i < bass.length && i >= ~~(visualizer.dataArray.length * visualizer.bassBounce.sensitivityStart)) ctx.fillStyle = '#FFF';
                    barHeight = visualizer.dataArray[i] * heightModifier() * (visualizer.bassBounce.enabled ? (bassSmoothRadius / 128 + 0.25) : 1);

                    if(visualizer.move == 'Outside' || visualizer.move == 'Both Sides') outerRadius = radius + barHeight;
                    else outerRadius = radius;
                    if(visualizer.move == 'Inside' || visualizer.move == 'Both Sides') innerRadius = radius - barHeight;
                    else innerRadius = radius;
                    if(outerRadius < 0) outerRadius = 0;
                    if(innerRadius < 0) innerRadius = 0;

                    ctx.beginPath();
                    ctx.arc(0, 0, innerRadius, -barWidth, barWidth);
                    ctx.arc(0, 0, outerRadius, barWidth, -barWidth, true);
                    ctx.fill();
                    ctx.rotate(backwards ? -barTotal : barTotal); // rotate the coordinates by one block
                }
                ctx.restore();
            }

            if(visualizer.startsFrom == 'Right' ||
                visualizer.startsFrom == 'Center' ||
                visualizer.startsFrom == 'Edges') drawArcs();

            if(visualizer.startsFrom == 'Left' ||
                visualizer.startsFrom == 'Center' ||
                visualizer.startsFrom == 'Edges') drawArcs(true);
        }
    }
})();