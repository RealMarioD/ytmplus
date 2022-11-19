/* eslint-disable no-undef */
// ==UserScript==
// @name         YTM+
// @namespace    http://tampermonkey.net/
// @version      1.3.0
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

    let open = false; // Used to track if config window is open or not
    let pageDiv; // The player "overlay"
    let upgradeText;
    let clockFunc;
    let noAfk;
    let noPromo;
    // 'type': 'color'; just results in a text input, they are later converted to actual color input
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
            // open function is mostly customizing settings UI
            'open': (doc, win, frame) => {
                frame.style.width = '550px';
                frame.style.height = '740px';
                frame.style.display = 'block';
                frame.style.margin = 'auto';
                frame.style.inset = '0';
                frame.style.boxShadow = '20px 20px 40px rgba(10, 10, 10, 0.8)';
                frame.style.border = '';
                frame.style.borderRadius = '25px';
                doc.querySelectorAll('*').forEach((node) => {
                    node.style.fontFamily = 'monospace';
                    node.style.color = 'rgba(255, 255, 255, 0.8)';
                });
                doc.body.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';


                const title = doc.getElementById('ytmPlusCfg_header');
                title.style.fontSize = '69px';
                title.style.marginBottom = '20px';

                const fieldTitles = doc.getElementsByClassName('section_header center');
                for(let i = 0; i < fieldTitles.length; i++) {
                    const e = fieldTitles[i];
                    e.style.marginBottom = '4px';
                    e.style.fontSize = '24px';
                }

                const fieldLabels = doc.getElementsByClassName('field_label');
                for(const field of fieldLabels) {
                    field.style.fontSize = '19px';
                    field.style.verticalAlign = 'middle';
                }

                const options = doc.getElementsByClassName('config_var');
                for(const o of options) o.style.textAlign = 'center';

                const buttons = doc.getElementById('ytmPlusCfg_buttons_holder');
                buttons.style.textAlign = 'center';
                for(let i = 0; i < buttons.children.length - 1; i++) applyTypeAndColor(buttons.children[i]);

                const inputs = doc.getElementsByTagName('input');
                for(let i = 0; i < inputs.length; i++) if(inputs[i].type == 'checkbox') inputs[i].style.verticalAlign = 'middle';

                applyTypeAndColor(doc.getElementById('ytmPlusCfg_field_bgColor'), true);
                applyTypeAndColor(doc.getElementById('ytmPlusCfg_field_bgGradient'), true);
                applyTypeAndColor(doc.getElementById('ytmPlusCfg_field_clockColor'), true);
                applyTypeAndColor(doc.getElementById('ytmPlusCfg_field_clockGradientColor'), true);
                applyTypeAndColor(doc.getElementById('ytmPlusCfg_field_clock'));

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
                    addFancy(document.body.style, true);
                    addFancy(pageDiv.style);
                }

                if(GM_config.get('clock') == 'Digital Clock') clockEnable('Digital Clock');
                else if(GM_config.get('clock') == 'Original') clockEnable('Original');
                else clockEnable('Remove Button');

                if(GM_config.get('noAfk') == true) afkEnable();
                else afkEnable(true);

                if(GM_config.get('noPromo') == true) promoEnable();
                else promoEnable(true);
            }
        }
    });

    // window.addEventListener('resize', () => fixCover());

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
        const navBarBg = document.getElementById('nav-bar-background');

        if(GM_config.get('noPromo') == true) promoEnable();

        // Credit to q1k - https://greasyfork.org/en/users/1262-q1k
        if(GM_config.get('noAfk') == true) afkEnable();

        if(GM_config.get('bg') == true) {
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

        // Rewrites or removes the "Upgrade" button at the top
        if(GM_config.get('clock') == 'Digital Clock') clockEnable('Digital Clock');
        else if(GM_config.get('clock') == 'Original') clockEnable('Original');
        else clockEnable('Remove Button');

        if(GM_config.get('visualizer') == true) {
            // Creating a canvas in nav-bar-background as that's the only div where you can create an element without the site breaking lmao
            navBarBg.innerHTML = '<canvas id="canvas" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;"></canvas>';
            navBarBg.style.opacity = 1;
            getVideo();
        }

        // Cursed settings button
        node = document.createElement('iframe');
        node.id = 'ytmPSettings';
        node.src = 'about:blank';
        node.style = 'top: 7px; left: 100px; height: 50px; opacity: 1; overflow: auto; padding: 0px; position: fixed; width: 50px; z-index: 9999; overflow: hidden;';
        document.body.appendChild(node);
        const frameDoc = document.getElementById('ytmPSettings').contentWindow.document;
        frameDoc.body.innerHTML = '<svg id="openSettings" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="display: block; width: 100%; height: 100%; fill: white;"><g class="style-scope yt-icon"><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11 l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11 l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51L13.22,21h-2.44l-0.55-2.2l-0.13-0.51 l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59l0.37-0.36l-0.08-0.51 C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62l0.5,0.14l0.4-0.32 C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14L4.34,5.27l-2,3.46 l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83c0.6,0.48,1.27,0.87,2,1.14L10,22h4 l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13 l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z" class="style-scope yt-icon"></path></g></svg>';
        frameDoc.getElementById('openSettings').addEventListener('click', () => {
            GM_config.open();
        });
    });

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

    // ytmusic-popup-container actually includes right-click menus and other stuff too so this function actually breaks the site
    let popup;
    function promoEnable(turnOff) {
        if(turnOff) clearInterval(noPromo);
        else {
            clearInterval(noPromo);
            noPromo = setInterval(() => {
                popup = document.getElementsByTagName('ytmusic-popup-container');
                if(popup.length > 0) {
                    popup[0].remove();
                    console.log('YTM+: Removed a promotion.');
                }
            }, 1000);
        }
    }

    function applyTypeAndColor(iH, applyType) {
        if(applyType) iH.type = 'color';
        iH.style.verticalAlign = 'middle';
        iH.style.backgroundColor = 'rgba(66, 66, 66, 0.8)';
    }

    function afkEnable(turnOff) {
        if(turnOff == true) clearInterval(noAfk);
        else {
            clearInterval(noAfk);
            noAfk = setInterval(function() {
                document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 }));
                console.log('YTM+: Nudged the page so user is not AFK.');
            }, 60000);
        }
    }

    function clockEnable(mode) {
        if(mode == 'Original') {
            clearTimeout(clockFunc);
            upgradeText.textContent = 'Upgrade';
            upgradeText.parentElement.style.margin = '0px 24px';
        }
        else if(mode == 'Digital Clock') {
            clearTimeout(clockFunc);
            updateTime(upgradeText);
            upgradeText.parentElement.style.margin = '0px 24px';
        }
        else {
            clearTimeout(clockFunc);
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
        clockFunc = setTimeout(function() {
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

    function visualizer() {
        const context = new AudioContext();
        const src = context.createMediaElementSource(v);
        const analyser = context.createAnalyser();

        const canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight / 2;
        const ctx = canvas.getContext('2d');

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.5;

        const bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        const dataArray = new Uint8Array(bufferLength);

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        const barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        function renderFrame() {
            requestAnimationFrame(renderFrame);

            x = 0;

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            for(let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 2;

                const r = GM_config.get('visR') == true ? barHeight / 2 : 0;
                const g = GM_config.get('visG') == true ? barHeight / 2 : 0;
                const b = GM_config.get('visB') == true ? barHeight / 2 : 0;

                ctx.fillStyle = `rgb(${r}, ${g}, ${b}, 0.5)`; // "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }
        renderFrame();
    }
})();