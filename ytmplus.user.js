/* eslint-disable no-undef */
// ==UserScript==
// @name         ytmPlus
// @namespace    http://tampermonkey.net/
// @version      1.6.1
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
    let pageDiv; // Set to the player "overlay" in window.onload
    let upgradeText; // Set to the upgrade "button" in window.onload
    let clockFunction; // Holds the timeout function that updates the digital clock
    let noAfkFunction; // Holds the anti-afk interval function
    let noPromoFunction; // Holds the no promotions function
    let skipFunction; // Holds the skip disliked songs function
    let dumbFix = 0; // idek what to type here, DOMSubtreeModified fires twice, this helps code run only once lmao
    let visualizerColor; // Stores config
    let visualizerStyle; // Stores config
    let visualizerFade; // Stores config
    let navBarBg; // Holds the navbar bg's div, visualizer canvas is injected into its innerHTML
    let analyser;
    let bufferLength;
    let dataArray;

    // 'type': 'color'; just results in a text input, they are later converted to actual color input, see open event (because GM_config wiki over fucking engineered the custom field type stuff so i dont really understand it and cba to set it up correctly)
    const GM_config = new GM_configStruct({
        'id': 'ytmPlusCfg',
        'title': 'ytmPlus',
        'fields': {
            'noAfk': {
                'label': 'Never AFK',
                'section': 'Utilities',
                'type': 'checkbox',
                'default': true
            },
            'noPromo': {
                'label': 'No Promotions (works but breaks site)',
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
                'default': false
            },
            'visualizer': {
                'label': 'Enable (Refresh for changes)',
                'section': 'Music Visualizer',
                'type': 'checkbox',
                'default': true
            },
            'visualizerStyle': {
                'label': 'Visualizer Starts from',
                'type': 'select',
                'options': ['Left', 'Inside', 'Right', 'Outside'],
                'default': 'Inside'
            },
            'visualizerColor': {
                'label': 'Visualizer Color',
                'type': 'color',
                'default': '#8C008C'
            },
            'visualizerFade': {
                'label': 'Enable Bar Fade',
                'type': 'checkbox',
                'default': true
            },
            'visualizerFft': {
                'label': 'Bar Intensity',
                'type': 'select',
                'options': ['32', '64', '128', '256', '512', '1024', '2048', '4096', '8192', '16384'],
                'default': '256'
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
            input {
                vertical-align: middle;
                background-color: rgba(66, 66, 66, 0.8);
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
                font-size: 2vh
            }
            #ytmPlusCfg .reset {
                color: rgba(255, 255, 255, 0.8);
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

                doc.getElementById('ytmPlusCfg_field_bgColor').type = 'color';
                doc.getElementById('ytmPlusCfg_field_bgGradient').type = 'color';
                doc.getElementById('ytmPlusCfg_field_clockColor').type = 'color';
                doc.getElementById('ytmPlusCfg_field_clockGradientColor').type = 'color';
                doc.getElementById('ytmPlusCfg_field_visualizerColor').type = 'color';

                const node = doc.createElement('div');
                node.id = 'cfgHolder';
                node.style.overflowY = 'auto';
                node.style.maxHeight = '80vh';
                node.style.display = 'block';
                const wrapper = doc.getElementById('ytmPlusCfg_wrapper');
                wrapper.appendChild(node);
                for(let i = 0; i < wrapper.childNodes.length; i++) node.appendChild(wrapper.childNodes[1]);
                wrapper.appendChild(wrapper.childNodes[1]);

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
                    pageDiv.style.backgroundColor = '#000000';
                    pageDiv.style.backgroundImage = '';
                }
                else {
                    try {
                        document.getElementsByClassName('ytmusic-immersive-background style-scope ytmusic-browse-response-response')[0].children[0].remove();
                    }
                    catch {}
                    document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';
                    addFancy(document.body.style, true);
                    addFancy(pageDiv.style);
                }

                clockEnable(GM_config.get('clock'));

                afkEnable(GM_config.get('noAfk'));

                promoEnable(GM_config.get('noPromo'));

                skipDisliked(GM_config.get('skipDisliked'));

                const saveBtn = document.getElementById('ytmPlusCfg').contentWindow.document.getElementById('ytmPlusCfg_saveBtn');
                saveBtn.innerText = 'Saved!';
                setTimeout(() => {
                    try {
                        saveBtn.innerText = 'Save';
                    }
                    catch {}
                }, 2000);

                visualizerColor = GM_config.get('visualizerColor');
                visualizerStyle = GM_config.get('visualizerStyle');
                visualizerFade = GM_config.get('visualizerFade');
                getBufferData();
                window.dispatchEvent(new Event('resize'));

                extraButtons(GM_config.get('extraButtons'));
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
        // Setting up CSS and initial stuff for later use
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

        pageDiv = document.getElementsByClassName('content style-scope ytmusic-player-page')[0];
        navBarBg = document.getElementById('nav-bar-background');

        promoEnable(GM_config.get('noPromo'));

        // Credit to q1k - https://greasyfork.org/en/users/1262-q1k
        afkEnable(GM_config.get('noAfk'));

        if(GM_config.get('bg') == true) {
            document.getElementsByTagName('ytmusic-browse-response')[0].children[0].remove();
            document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';
            addFancy(document.body.style, true);
            addFancy(pageDiv.style);
        }

        // Tries to removes weird padding between and above album cover and navbar
        if(GM_config.get('padding') == true) {
            pageDiv.style.paddingTop = '0px';
            const mainPanel = document.getElementById('main-panel');
            mainPanel.style.marginTop = '8vh';
            mainPanel.style.marginBottom = '8vh';
        }

        // Rewrites or removes the "Upgrade" button at the top
        clockEnable(GM_config.get('clock'));

        if(GM_config.get('visualizer') == true) {
            visualizerColor = GM_config.get('visualizerColor');
            visualizerStyle = GM_config.get('visualizerStyle');
            visualizerFade = GM_config.get('visualizerFade');
            // Creating a canvas in nav-bar-background as that's the only div where you can create an element without the site breaking lmao
            navBarBg.innerHTML = '<canvas id="canvas" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;"></canvas>';
            navBarBg.style.opacity = 1;
            getVideo();
        }

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
            GM_config.open();
        });
    });

    // ytmusic-popup-container actually includes right-click menus and other stuff too, might break site, not tested because popups dont come when i need them
    let popup;
    function promoEnable(turnOn) {
        if(!turnOn) clearInterval(noPromoFunction);
        else {
            clearInterval(noPromoFunction);
            noPromoFunction = setInterval(() => {
                popup = document.getElementsByTagName('tp-yt-paper-dialog');
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
            noAfkFunction = setInterval(function() {
                document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 }));
                console.log('ytmPlus: Nudged the page so user is not AFK.');
            }, 15000);
        }
    }

    function clockEnable(mode) {
        if(mode == 'Original') {
            clearTimeout(clockFunction);
            upgradeText.textContent = 'Upgrade';
            // upgradeText.parentElement.style.margin = '0px 24px';
        }
        else if(mode == 'Digital Clock') {
            clearTimeout(clockFunction);
            updateTime(upgradeText);
            // upgradeText.parentElement.style.margin = '0px 24px';
        }
        else {
            clearTimeout(clockFunction);
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

    let currentTime;
    function updateTime(updateText) {
        currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        updateText.textContent = currentTime;
        clockFunction = setTimeout(function() {
            updateTime(updateText);
        }, 1000);
    }

    let v;
    function getVideo() {
        v = document.querySelector('video');
        if(v) visualizer();
        else {
            console.warn('Warning: Query "video" not found, retrying in 100ms.');
            setTimeout(() => { getVideo(); }, 100);
        }
    }

    function getBufferData() {
        analyser.fftSize = GM_config.get('visualizerFft');
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }
    function visualizer() {
        const context = new AudioContext();
        const src = context.createMediaElementSource(v);
        analyser = context.createAnalyser();

        const canvas = document.getElementById('canvas');
        canvas.width = navBarBg.offsetWidth;
        canvas.height = navBarBg.offsetHeight;
        const ctx = canvas.getContext('2d');

        src.connect(analyser);
        analyser.connect(context.destination);

        getBufferData();
        analyser.smoothingTimeConstant = 0.5;

        let WIDTH = canvas.width;
        let HEIGHT = canvas.height;

        let barWidth = (WIDTH / bufferLength);
        let barSpace = barWidth * 0.05;
        barWidth *= 0.95;

        function visualizerResizeFix() {
            canvas.width = navBarBg.offsetWidth;
            canvas.height = navBarBg.offsetHeight;

            WIDTH = canvas.width;
            HEIGHT = canvas.height;

            barWidth = (WIDTH / bufferLength);
            barSpace = barWidth * 0.05;
            barWidth *= 0.95;
        }

        window.addEventListener('resize', visualizerResizeFix);

        let barHeight;
        let x;

        function renderFrame() {
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            visualizerEffect();
            requestAnimationFrame(renderFrame);
        }
        renderFrame();

        function visualizerEffect() {
            switch(visualizerStyle) {
                case 'Inside': x = barWidth / 2; break;
                case 'Outside': x = barSpace / 2; break;
                default: x = 0; break;
            }

            for(let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * (HEIGHT / 255);
                ctx.fillStyle = `${visualizerColor}${visualizerFade ? (barHeight / (HEIGHT / 255)).toString(16) : ''}`;
                if(visualizerStyle == 'Left') {
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                    x += barWidth + barSpace;
                }
                else if(visualizerStyle == 'Inside') {
                    if(WIDTH / 2 - x < 0 - barWidth) break;
                    ctx.fillRect(WIDTH / 2 - x, HEIGHT - barHeight, barWidth, barHeight);
                    x += barWidth + barSpace;
                }
                else if(visualizerStyle == 'Right') {
                    ctx.fillRect(WIDTH - x, HEIGHT - barHeight, 0 - barWidth, barHeight);
                    x += barWidth + barSpace;
                }
                else if(visualizerStyle == 'Outside') {
                    if(x > WIDTH / 2) break; // || x + barWidth + barSpace > WIDTH / 2
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                    x += barWidth + barSpace;
                }
            }
            if(visualizerStyle == 'Inside') x = WIDTH / 2 + barWidth / 2 + barSpace;
            else if(visualizerStyle == 'Outside') x = barWidth + (barSpace / 2);
            else return;
            for(let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * (HEIGHT / 255);
                ctx.fillStyle = `${visualizerColor}${visualizerFade ? (barHeight / (HEIGHT / 255)).toString(16) : ''}`;
                if(visualizerStyle == 'Inside') {
                    if(x > WIDTH) break;
                    else if(i != 0) {
                        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                        x += barWidth + barSpace;
                    }
                }
                else if(visualizerStyle == 'Outside') {
                    if(x > WIDTH / 2) break;
                    ctx.fillRect(WIDTH - x, HEIGHT - barHeight, barWidth, barHeight);
                    x += barWidth + barSpace;
                }
            }
        }
    }

    function checkDislike() {
        if(dumbFix == 0) return dumbFix++;
        clearTimeout(skipFunction);
        skipFunction = setTimeout(() => {
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
})();