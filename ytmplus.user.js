// ==UserScript==
// @name         YTM+
// @namespace    http://tampermonkey.net/
// @version      1.2.1
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

(function () {
    'use strict';

    let open = false; // Used to track if config window is open or not
    let pageDiv; // The player "overlay"
    let upgradeText;
    let clockFunc;
    let noAfk;
    let noPromo;
    let GM_config = new GM_configStruct({
        'id': 'ytmPlusCfg',
        'title': 'Settings',
        'fields': {
            'noAfk': {
                'label': 'Never AFK',
                'section': 'Utilities',
                'type': 'checkbox',
                'default': true
            },
            'noPromo': {
                'label': 'No Promotions ("Try premium for free!")',
                'type': 'checkbox',
                'default': true
            },
            'padding': {
                'label': 'Change Padding (Refresh for changes)',
                'type': 'checkbox',
                'default': true
            },
            'visualizer': {
                'label': 'Enable Music Visualizer (Refresh for changes)',
                'type': 'checkbox',
                'default': true
            },
            'visR': {
                'label': 'Red',
                'section': 'Visualizer Colors (Currently Limited)',
                'type': 'checkbox',
                'default': true
            },
            'visG': {
                'label': 'Green',
                'type': 'checkbox',
                'default': false
            },
            'visB': {
                'label': 'Blue',
                'type': 'checkbox',
                'default': true
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
                'section': 'Upgrade Button / Digital Clock',
                'type': 'select',
                'options': ['Original', 'Remove Button', 'Digital Clock'],
                'default': 'Digital Clock'
            },
            'clockColor': {
                'label': 'Color',
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
        'events': {
            'open': (doc, win, frame) => {
                // Customizing settings UI
                frame.style.width = '550px';
                // frame.style.height = '500px';
                frame.style.display = 'block';
                frame.style.margin = 'auto';
                frame.style.inset = '0';
                frame.style.boxShadow = '20px 20px 40px rgba(10, 10, 10, 0.8)'
                frame.style.border = '';
                frame.style.borderRadius = '25px'
                doc.querySelectorAll('*').forEach((node) => {
                    node.style.fontFamily = 'monospace';
                    node.style.color = 'rgba(0, 204, 0, 0.8)';
                });
                doc.body.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';


                let title = doc.getElementById('ytmPlusCfg_header');
                title.style.fontSize = '69px';
                title.style.marginBottom = '20px';

                let fieldLabels = doc.getElementsByClassName('field_label');
                for (let field of fieldLabels) field.style.fontSize = '16px'

                let options = doc.getElementsByClassName('config_var');
                for (let o of options) o.style.textAlign = 'center';

                let buttons = doc.getElementById('ytmPlusCfg_buttons_holder');
                buttons.style.textAlign = 'center';
                for (let i = 0; i < buttons.children.length - 1; i++) applyTnC(buttons.children[i]);

                let iH = doc.getElementById('ytmPlusCfg_field_bgColor');
                applyTnC(iH, true);
                iH = doc.getElementById('ytmPlusCfg_field_bgGradient');
                applyTnC(iH, true);
                iH = doc.getElementById('ytmPlusCfg_field_clockColor');
                applyTnC(iH, true);
                iH = doc.getElementById('ytmPlusCfg_field_clockGradientColor');
                applyTnC(iH, true);
                iH = doc.getElementById('ytmPlusCfg_field_clock');
                applyTnC(iH);

                open = true;
            },
            'close': () => {
                open = false;
            },
            'save': () => {
                // Updates updateable stuff on save
                if (GM_config.get('bg') == false) {
                    document.body.style.backgroundColor = '#000000';
                    document.body.style.backgroundImage = '';
                    pageDiv.style.backgroundColor = '#000000';
                    pageDiv.style.backgroundImage = '';
                }
                else {
                    addFancy(document.body.style, true);
                    addFancy(pageDiv.style);
                }

                if (GM_config.get('clock') == 'Digital Clock') clockEnable('Digital Clock');
                else if (GM_config.get('clock') == 'Original') clockEnable('Original');
                else clockEnable('Remove Button')

                if (GM_config.get('noAfk') == true) afkEnable();
                else afkEnable(true);

                if(GM_config.get('noPromo') == true) promoEnable();
                else promoEnable(true);
            }
        }
    })

    // window.addEventListener('resize', () => fixCover());

    // Code that opens/closes settings UI
    window.addEventListener('keydown', (ev) => {
        if (ev.code == 'Backslash' && ev.ctrlKey == true) {
            if (open === false) {
                GM_config.open();
                open = true;
            }
            else {
                GM_config.close();
                open = false;
            }
        }
    })

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
        }`
        const node = document.createElement('style');
        const textNode = document.createTextNode(animation);
        node.appendChild(textNode);
        document.head.appendChild(node);

        pageDiv = document.getElementsByClassName("content style-scope ytmusic-player-page")[0];
        const nbb = document.getElementById('nav-bar-background');
	    
	if(GM_config.get('noPromo') == true) promoEnable();

        // Credit to q1k - https://greasyfork.org/en/users/1262-q1k
        if (GM_config.get('noAfk') == true) afkEnable();

        if (GM_config.get('bg') == true) {
            addFancy(document.body.style, true);
            addFancy(pageDiv.style);
        }

        // Tries to removes weird padding between and above album cover and navbar
        if (GM_config.get('padding') == true) {
            pageDiv.style.paddingTop = '0px';
            const mainPanel = document.getElementById("main-panel");
            mainPanel.style.marginTop = '8vh';
            mainPanel.style.marginBottom = '8vh';
        }

        // Centers album cover OLD
        /*
        const player = document.getElementById('player');
        player.style.marginTop = '1vh';
        player.style.marginBottom = '1vh';
        */
        // fixCover(); // Break the list thingy on the right

        // Removes buttons - YT removed them
        /*
        const buttons = document.getElementsByClassName('av-toggle style-scope ytmusic-av-toggle')[0];
        buttons.remove();
        */

        // Rewrites the "Upgrade" button at the top to say the time with fancy colors YEP
        if (GM_config.get('clock') == 'Digital Clock') clockEnable('Digital Clock');
        else if (GM_config.get('clock') == 'Original') clockEnable('Original');
        else clockEnable('Remove Button')

        if (GM_config.get('visualizer') == true) {
            // Creating a canvas in nav-bar-background as that's the only div where you can create an element without the site breaking lmao
            nbb.innerHTML = `<canvas id="canvas" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;"></canvas>`;
            nbb.style.opacity = 1;
            getVideo();
        }
    })

    // Functions for code
    /*
    // Not fully implemented stuff, doesn't work
    function vh(v) {
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return (v * h) / 100;
    }

    function fixCover() {
        const player = document.getElementsByClassName('style-scope ytmusic-player-page')[1];
        player.style.marginTop = `${vh(5)}px`;
        player.style.marginBottom = `${vh(5)}px`;
    }
    */

    let popup;
    function promoEnable(off) {
        if (off) clearInterval(noPromo);
        else {
            clearInterval(noPromo);
            noPromo = setInterval(() => {
                popup = document.getElementsByTagName('ytmusic-popup-container');
                if (popup.length > 0) {
                    popup[0].remove();
                    console.log('YTM+: Removed a promotion.');
                }
            }, 1000);
        }
    }

    function applyTnC(iH, modType) {
        if (modType) iH.type = 'color';
        iH.style.backgroundColor = 'rgba(66, 66, 66, 0.8)'
    }

    function afkEnable(off) {
        if (off == true) clearInterval(noAfk);
        else {
            clearInterval(noAfk);
            noAfk = setInterval(function () {
                document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 }));
                console.log('YTM+: Nudged the page so user is not AFK.')
            }, 60000);
        }
    }

    function clockEnable(mode) {
        if (mode == 'Original') {
            clearTimeout(clockFunc);
            upgradeText.textContent = 'Upgrade'
            upgradeText.parentElement.style.margin = '0px 24px';
        }
        else if (mode == 'Digital Clock') {
            clearTimeout(clockFunc);
            updTime(upgradeText);
            upgradeText.parentElement.style.margin = '0px 24px';
        }
        else {
            clearTimeout(clockFunc);
            upgradeText.textContent = ''
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

    function addFancy(e, overflow) {
        e.backgroundImage = `linear-gradient(45deg, ${GM_config.get('bgColor')}, ${GM_config.get('bgEnableGradient') == true ? GM_config.get('bgGradient') : GM_config.get('bgColor')})`;
        e.animation = 'gradient 5s linear infinite alternate';
        e.backgroundSize = '150% 150%';
        e.backgroundAttachment = 'fixed';
        // e.height = '100vh';
        if (!overflow) e.overflow = 'hidden';
    }

    let cT;
    function updTime(uT) {
        cT = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        uT.textContent = cT;
        clockFunc = setTimeout(function () {
            updTime(uT)
        }, 1000)
    }

    let v;
    function getVideo() {
        v = document.querySelector('video');
        if (v) visualizer()
        else {
            console.warn('Warning: Query "video" not found, retrying in 100ms.');
            setTimeout(() => { getVideo() }, 100);
        }
    }

    function visualizer() {
        var context = new AudioContext();
        var src = context.createMediaElementSource(v);
        var analyser = context.createAnalyser();

        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight / 2;
        var ctx = canvas.getContext("2d");

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.5;

        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        var dataArray = new Uint8Array(bufferLength);

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        function renderFrame() {
            requestAnimationFrame(renderFrame);

            x = 0;

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 2;

                var r = GM_config.get('visR') == true ? barHeight / 2 : 0;
                var g = GM_config.get('visG') == true ? barHeight / 2 : 0;
                var b = GM_config.get('visB') == true ? barHeight / 2 : 0;

                ctx.fillStyle = `rgb(${r}, ${g}, ${b}, 0.5)`; // "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }
        renderFrame();
    }
})();
