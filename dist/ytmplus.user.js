// ==UserScript==
// @name         ytmPlus
// @version      2.0.0
// @author       Mario_D#7052
// @license      MIT
// @namespace    http://tampermonkey.net/
// @updateURL    https://github.com/RealMarioD/ytmplus/raw/main/ytmplus.user.js
// @downloadURL  https://github.com/RealMarioD/ytmplus/raw/main/ytmplus.user.js
// @description  Ever wanted some nice addons for YouTube Music? If yes, you are at the right place.
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

    /* eslint-disable no-undef */
    const globals = {
        settingsOpen: false, // Used to track if config window is open or not
        playerPageDiv: undefined, // Set to the player "overlay" in window.onload
        upgradeButton: undefined, // Set to the upgrade "button" in window.onload
        originalUpgradeText: undefined,
        clockFunction: undefined, // Holds the interval function that updates the digital clock
        noAfkFunction: undefined, // Holds the anti-afk interval function
        noPromoFunction: undefined, // Holds the no promotions function
        skipDislikedFunction: undefined, // Holds the skip disliked songs function
        dumbFix: 0, // idek what to type here, DOMSubtreeModified fires twice, this helps code run only once lmao
        navBarBg: undefined, // Holds the navbar bg's div, visualizer canvas is injected into its innerHTML
        mainPanel: undefined, // Holds something from around the album cover, - - | | - -
        visualizer: {
            place: undefined,
            startsFrom: undefined,
            color: undefined,
            fade: undefined,
            circleEnabled: undefined,
            rotate: undefined,
            rotateDirection: undefined,
            move: undefined,
            cutOff: 0.1625,
            rgb: {
                enabled: undefined,
                red: undefined,
                green: undefined,
                blue: undefined,
                samples: undefined
            },
            bassBounce: {
                enabled: null,
                sensitivityStart: null,
                sensitivityEnd: null,
                smooth: null,
                debug: null
            },
            rgbData: [],
            analyser: undefined,
            bufferLength: null,
            dataArray: null,
            getBufferData() {
                this.analyser.fftSize = GM_config.get('visualizerFft');
                this.bufferLength = this.analyser.frequencyBinCount - Math.floor(this.analyser.frequencyBinCount * this.cutOff); // We cut off the end because data is 0, making visualizer's end flat
                this.dataArray = new Uint8Array(this.bufferLength);
            },
            initValues() {
                /**
                 * Visualizer keys must have identical names with their GM_config equivalent, e.g.: visualizer.place = 'visualizerPlace'
                 * Following this rule we can iterate through the visualizer object and automatically get all configs and their values.
                 * (bassBounce is the last thing it checks so any values that should be initialised/changed upon saving should be set above bassBounce)
                 */
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
                            if(key == 'bassBounce') return;
                            if(this.analyser !== undefined) {
                                this.analyser.smoothingTimeConstant = GM_config.get('visualizerSmoothing');
                                this.analyser.minDecibels = GM_config.get('visualizerMinDecibels');
                                this.analyser.maxDecibels = GM_config.get('visualizerMaxDecibels');
                            }
                        }
                        else this[key] = GM_config.get(gmName);
                    }
                }
            },
            getRGB() {
                const hue = 2 * Math.PI / this.rgb.samples, piD3 = Math.PI / 3, piD3x2 = 2 * Math.PI / 3;
                this.rgbData = [];
                for(let i = 0; i < this.rgb.samples; i++) {
                    this.rgbData[i] = {
                        red: Math.abs(this.rgb.red * Math.sin(i * hue)),
                        green: Math.abs(this.rgb.green * Math.sin(i * hue + piD3)),
                        blue: Math.abs(this.rgb.blue * Math.sin(i * hue + piD3x2))
                    };
                }
            }
        }
    };

    function promoEnable(turnOn) {
        let popup;
        if(!turnOn) clearInterval(globals.noPromoFunction);
        else {
            clearInterval(globals.noPromoFunction);
            globals.noPromoFunction = setInterval(() => {
                popup = document.getElementsByTagName('ytmusic-mealbar-promo-renderer');
                if(popup.length > 0) {
                    popup[0].remove();
                    console.log('ytmPlus: Removed a promotion.');
                }
            }, 1000);
        }
    }

    function afkEnable(turnOn) {
        if(!turnOn) clearInterval(globals.noAfkFunction);
        else {
            clearInterval(globals.noAfkFunction);
            globals.noAfkFunction = setInterval(() => {
                document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 }));
                console.log('ytmPlus: Nudged the page so user is not AFK.');
            }, 15000);
        }
    }

    function clockEnable(mode) {
        let currentTime;
        if(mode == 'Original') {
            clearInterval(globals.clockFunction);
            globals.upgradeButton.textContent = globals.originalUpgradeText;
            globals.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
        }
        else if(mode == 'Digital Clock') {
            clearInterval(globals.clockFunction);
            globals.clockFunction = setInterval(() => {
                currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                globals.upgradeButton.textContent = currentTime;
            }, 1000);
            globals.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
        }
        else {
            clearInterval(globals.clockFunction);
            globals.upgradeButton.textContent = '';
            globals.upgradeButton.parentElement.style.margin = '0px';
        }
        const a = globals.upgradeButton.style;
        a.background = mode != 'Digital Clock' ? '' : `linear-gradient(to right, ${GM_config.get('clockColor')} 0%, ${GM_config.get('clockGradient') == true ? GM_config.get('clockGradientColor') : GM_config.get('clockColor')} 50%, ${GM_config.get('clockColor')} 100%`;
        a.backgroundSize = mode != 'Digital Clock' ? '' : '200% auto';
        a.backgroundClip = mode != 'Digital Clock' ? '' : 'text';
        a.textFillColor = mode != 'Digital Clock' ? '' : 'transparent';
        a.webkitBackgroundClip = mode != 'Digital Clock' ? '' : 'text';
        a.webkitTextFillColor = mode != 'Digital Clock' ? '' : 'transparent';
        a.fontSize = mode != 'Digital Clock' ? '20px' : '50px';
        a.animation = mode != 'Digital Clock' ? '' : 'clockGradient 2s linear infinite normal';
    }

    function addFancy(e, overflowOn) {
        e.backgroundImage = `linear-gradient(45deg, ${GM_config.get('bgColor')}, ${GM_config.get('bgEnableGradient') == true ? GM_config.get('bgGradient') : GM_config.get('bgColor')})`;
        e.animation = 'backgroundGradient 5s linear infinite alternate';
        e.backgroundSize = '150% 150%';
        e.backgroundAttachment = 'fixed';
        // e.height = '100vh';
        if(!overflowOn) e.overflow = 'hidden';
    }

    function checkDislike() {
        if(globals.dumbFix == 0) return globals.dumbFix++;
        clearTimeout(globals.skipDislikedFunction);
        globals.skipDislikedFunction = setTimeout(() => {
            if(document.getElementById('like-button-renderer').children[0].ariaPressed == 'true') document.getElementsByClassName('next-button style-scope ytmusic-player-bar')[0].click();
        }, 5000);
        globals.dumbFix = 0;
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

    function averageOfArray(numbers) {
        let result = 0;
        for(let i = 0; i < numbers.length; i++) result += numbers[i];
        return result / numbers.length;
    }

    function visualizerCircle(ctx) { // Bitwise truncation (~~number) is used here instead of Math.floor() to squish out more performance.
        if(globals.visualizer.startsFrom === 'Left' || globals.visualizer.startsFrom === 'Right') values.circleSize = 2; // 2(pi) = full
        else values.circleSize = 1; // 1(pi) = half;

        if(globals.visualizer.bassBounce.enabled === true || globals.visualizer.rotate === 'Reactive (Bass)') {
            values.bass = globals.visualizer.dataArray.slice(
                ~~(globals.visualizer.dataArray.length * globals.visualizer.bassBounce.sensitivityStart),
                ~~(globals.visualizer.dataArray.length * globals.visualizer.bassBounce.sensitivityEnd) + 1
            );

            if(globals.visualizer.bassBounce.smooth === true) values.bassSmoothRadius = ~~((values.bassSmoothRadius + (averageOfArray(values.bass) / 2)) / 2);
            else values.bassSmoothRadius = ~~(averageOfArray(values.bass) / 2);

            if(globals.visualizer.bassBounce.enabled === true) values.radius = ~~(values.HEIGHT / 8) + values.bassSmoothRadius * values.heightModifier * 1.25;
        }

        switch(globals.visualizer.rotate) {
            case 'On':
                if(globals.visualizer.rotateDirection === 'Clockwise') values.rotationValue += 0.005;
                else values.rotationValue -= 0.005;
                break;
            case 'Reactive':
                if(globals.visualizer.rotateDirection === 'Clockwise') values.rotationValue += Math.pow(averageOfArray(globals.visualizer.dataArray) / 10000 + 1, 2) - 1;
                else values.rotationValue -= Math.pow(averageOfArray(globals.visualizer.dataArray) / 10000 + 1, 2) - 1;
                break;
            case 'Reactive (Bass)':
                if(globals.visualizer.rotateDirection === 'Clockwise') values.rotationValue += Math.pow(values.bassSmoothRadius / 10000 + 1, 2) - 1;
                else values.rotationValue -= Math.pow(values.bassSmoothRadius / 10000 + 1, 2) - 1;
                break;
            default: values.rotationValue = 0; break;
        }


        values.barTotal = values.circleSize * Math.PI / globals.visualizer.bufferLength;
        values.barWidth = values.barTotal * 0.45;
        // No need for barSpace
        values.reactiveBarHeightMultiplier = 0.3 + values.bassSmoothRadius / 512; // 0.3 . . 0.55

        function drawArcs(backwards) {
            ctx.save();
            ctx.translate(values.halfWidth, values.halfHeight); // move to center of circle
            ctx.rotate(values.startingPoint + values.rotationValue); // Set bar starting point to top + rotation

            const colorDivergence = (globals.visualizer.bufferLength / globals.visualizer.rgb.samples);
            for(let i = 0; i < globals.visualizer.bufferLength; ++i) {
                if(i === 0 && backwards === true) ctx.rotate(-values.barTotal);
                else {
                    if(globals.visualizer.rgb.enabled === true) {
                        const color = ~~(i / colorDivergence);
                        if(globals.visualizer.fade === true) ctx.fillStyle = `rgba(${globals.visualizer.rgbData[color].red}, ${globals.visualizer.rgbData[color].green}, ${globals.visualizer.rgbData[color].blue}, ${globals.visualizer.dataArray[i] < 128 ? globals.visualizer.dataArray[i] * 2 / 255 : 1.0})`;
                        else ctx.fillStyle = `rgb(${globals.visualizer.rgbData[color].red}, ${globals.visualizer.rgbData[color].green}, ${globals.visualizer.rgbData[color].blue})`;
                    }
                    else ctx.fillStyle = globals.visualizer.color;

                    if(globals.visualizer.bassBounce.debug === true && i < values.bass.length && i >= ~~(globals.visualizer.bufferLength * globals.visualizer.bassBounce.sensitivityStart)) ctx.fillStyle = '#FFF';

                    if(globals.visualizer.bassBounce.enabled === true) values.barHeight = globals.visualizer.dataArray[i] * values.heightModifier * values.reactiveBarHeightMultiplier;
                    else values.barHeight = globals.visualizer.dataArray[i] * values.heightModifier * 0.5;

                    if(globals.visualizer.move == 'Outside' || globals.visualizer.move == 'Both Sides') values.outerRadius = values.radius + values.barHeight;
                    else values.outerRadius = values.radius;

                    if(globals.visualizer.move == 'Inside' || globals.visualizer.move == 'Both Sides') values.innerRadius = values.radius - values.barHeight;
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
            }
            ctx.restore();
        }

        if(globals.visualizer.startsFrom === 'Right' ||
            globals.visualizer.startsFrom === 'Center' ||
            globals.visualizer.startsFrom === 'Edges') drawArcs();

        if(globals.visualizer.startsFrom === 'Left' ||
            globals.visualizer.startsFrom === 'Center' ||
            globals.visualizer.startsFrom === 'Edges') drawArcs(true);
    }

    function visualizerNavbar(ctx) {
        if(globals.visualizer.startsFrom === 'Center') values.xPosOffset = values.barWidth / 2; // Centers 1 bar
        else if(globals.visualizer.startsFrom === 'Edges') values.xPosOffset = values.barSpace / 2; // Both sides are offset a bit for perfect centering
        else values.xPosOffset = 0;

        const maxBarHeight = (values.HEIGHT / 255), colorDivergence = (globals.visualizer.bufferLength / globals.visualizer.rgbData.length);
        for(let i = 0; i < globals.visualizer.bufferLength; i++) {
            values.barHeight = globals.visualizer.dataArray[i] * maxBarHeight;

            if(globals.visualizer.rgb.enabled === true) {
                const color = ~~(i / colorDivergence);
                if(globals.visualizer.fade === true) ctx.fillStyle = `rgba(${globals.visualizer.rgbData[color].red}, ${globals.visualizer.rgbData[color].green}, ${globals.visualizer.rgbData[color].blue}, ${globals.visualizer.dataArray[i] < 128 ? globals.visualizer.dataArray[i] * 2 / 255 : 1.0})`;
                else ctx.fillStyle = `rgb(${globals.visualizer.rgbData[color].red}, ${globals.visualizer.rgbData[color].green}, ${globals.visualizer.rgbData[color].blue})`;
            }
            else ctx.fillStyle = globals.visualizer.color;

            // To this day I don't get the Y and values.HEIGHT values
            if(globals.visualizer.startsFrom === 'Left') {
                ctx.fillRect(values.xPosOffset, values.HEIGHT - values.barHeight, values.barWidth, values.barHeight); // Draws rect from left to right
                values.xPosOffset += values.barTotal;
            }
            else if(globals.visualizer.startsFrom === 'Center') {
                if(values.halfWidth - values.xPosOffset < 0 - values.barWidth) break;
                ctx.fillRect(values.halfWidth - values.xPosOffset, values.HEIGHT - values.barHeight, values.barWidth, values.barHeight); // Draws rect from left to right, starting from center to left
                values.xPosOffset += values.barTotal;
            }
            else if(globals.visualizer.startsFrom === 'Right') {
                ctx.fillRect(values.WIDTH - values.xPosOffset, values.HEIGHT - values.barHeight, 0 - values.barWidth, values.barHeight); // Draws rect from right to left
                values.xPosOffset += values.barTotal;
            }
            else if(globals.visualizer.startsFrom === 'Edges') {
                if(values.xPosOffset > values.halfWidth) break;
                ctx.fillRect(values.xPosOffset, values.HEIGHT - values.barHeight, values.barWidth, values.barHeight); // Draws rect from left to right, from left to center
                values.xPosOffset += values.barTotal;
            }
        }

        if(globals.visualizer.startsFrom === 'Center') values.xPosOffset = values.halfWidth + values.barWidth / 2 + values.barSpace; // Reset pos to center + skip first bar
        else if(globals.visualizer.startsFrom === 'Edges') values.xPosOffset = values.barWidth + (values.barSpace / 2); // Reset pos to right + offset for perfect center
        else return;

        for(let i = 1; i < globals.visualizer.bufferLength; i++) {
            values.barHeight = globals.visualizer.dataArray[i] * maxBarHeight;
            if(globals.visualizer.rgb.enabled === true) {
                const color = ~~(i / colorDivergence);
                if(globals.visualizer.fade === true) ctx.fillStyle = `rgba(${globals.visualizer.rgbData[color].red}, ${globals.visualizer.rgbData[color].green}, ${globals.visualizer.rgbData[color].blue}, ${globals.visualizer.dataArray[i] < 128 ? globals.visualizer.dataArray[i] * 2 / 255 : 1.0})`;
                else ctx.fillStyle = `rgb(${globals.visualizer.rgbData[color].red}, ${globals.visualizer.rgbData[color].green}, ${globals.visualizer.rgbData[color].blue})`;
            }
            else ctx.fillStyle = globals.visualizer.color;
            if(globals.visualizer.startsFrom === 'Center') {
                if(values.xPosOffset > values.WIDTH) break;
                ctx.fillRect(values.xPosOffset, values.HEIGHT - values.barHeight, values.barWidth, values.barHeight); // Draws rect from left to right, from center to right
                values.xPosOffset += values.barTotal;
            }
            else if(globals.visualizer.startsFrom === 'Edges') {
                if(values.xPosOffset > values.halfWidth) break;
                ctx.fillRect(values.WIDTH - values.xPosOffset, values.HEIGHT - values.barHeight, values.barWidth, values.barHeight); // Draws rect from left to right, from right to center
                values.xPosOffset += values.barTotal;
            }
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

    function startVisualizer() {
        // Init, connecting yt audio to canvas
        const player = document.getElementById('player');
        const context = new AudioContext();
        const src = context.createMediaElementSource(video);
        globals.visualizer.analyser = context.createAnalyser();

        let canvas, ctx;
        switch(globals.visualizer.place) {
            case 'Navbar': default: canvas = document.getElementById('visualizerNavbarCanvas'); break;
            case 'Album Cover': canvas = document.getElementById('visualizerAlbumCoverCanvas'); break;
        }
        ctx = canvas.getContext('2d');

        src.connect(globals.visualizer.analyser);
        globals.visualizer.analyser.connect(context.destination);

        globals.visualizer.initValues();
        globals.visualizer.getBufferData();

        // Helps set the canvas size to the correct values (navbar width, rectangle or square album cover, etc)
        setInterval(() => {
            visualizerResizeFix();
        }, 1000);
        function visualizerResizeFix() {
            switch(globals.visualizer.place) {
                case 'Navbar': default:
                    canvas.width = globals.navBarBg.offsetWidth;
                    canvas.height = globals.navBarBg.offsetHeight;
                    canvas.style.width = '';
                    canvas.style.height = '';
                    values.WIDTH = canvas.width;
                    values.halfWidth = values.WIDTH / 2;
                    values.HEIGHT = canvas.height;

                    if(globals.visualizer.startsFrom === 'Center' || globals.visualizer.startsFrom === 'Edges') values.barTotal = values.halfWidth / globals.visualizer.bufferLength;
                    else values.barTotal = values.WIDTH / globals.visualizer.bufferLength;
                    values.barSpace = values.barTotal * 0.05;
                    values.barWidth = values.barTotal * 0.95;
                    break;
                case 'Album Cover':
                    canvas.style.width = player.offsetWidth + 'px';
                    canvas.style.height = player.offsetHeight + 'px';
                    canvas.width = player.offsetWidth;
                    canvas.height = player.offsetHeight;
                    values.WIDTH = canvas.width;
                    values.halfWidth = values.WIDTH / 2;
                    values.HEIGHT = canvas.height;
                    values.halfHeight = values.HEIGHT / 2;

                    if(player.playerPageOpen_ === false) { // if miniplayer == true
                        canvas.style.bottom = getComputedStyle(player).bottom; // move the canvas over the miniplayer
                        canvas.style.left = getComputedStyle(player).left;
                    }
                    else {
                        canvas.style.removeProperty('bottom'); // else completely remove properties because html
                        canvas.style.removeProperty('left');
                    }

                    if(globals.visualizer.circleEnabled === false) {
                        if(globals.visualizer.startsFrom === 'Center' || globals.visualizer.startsFrom === 'Edges') values.barTotal = values.halfWidth / globals.visualizer.bufferLength;
                        else values.barTotal = values.WIDTH / globals.visualizer.bufferLength;
                        values.barSpace = values.barTotal * 0.05;
                        values.barWidth = values.barTotal * 0.95;
                    }
                    else if(globals.visualizer.bassBounce.enabled === false) {
                        values.radius = ~~(values.HEIGHT / 4);
                        values.heightModifier = (values.HEIGHT - values.radius) / 2 / 255;
                    }
                    else values.heightModifier = (values.HEIGHT - ~~(values.HEIGHT / 8)) / 2 / 255;
                    break;
                case 'Disabled': break;
            }
        }

        window.addEventListener('resize', visualizerResizeFix);
        if(globals.visualizer.rgb.enabled === true) globals.visualizer.getRGB();

        function renderFrame() {
            ctx.clearRect(0, 0, values.WIDTH, values.HEIGHT);

            if(video.paused === false && globals.visualizer.place !== 'Disabled') { // If playback is not paused and visualizer is not off
                globals.visualizer.analyser.getByteFrequencyData(globals.visualizer.dataArray); // Get audio data

                if(globals.visualizer.rgb.enabled === true) { // Color cycle effect
                    globals.visualizer.rgbData.push(globals.visualizer.rgbData[0]);
                    globals.visualizer.rgbData.shift();
                }

                if(globals.visualizer.place === 'Navbar') {
                    if(canvas.id !== 'visualizerNavbarCanvas') {
                        canvas = document.getElementById('visualizerNavbarCanvas');
                        ctx = canvas.getContext('2d');
                    }
                    visualizerNavbar(ctx);
                }
                else if(globals.visualizer.place === 'Album Cover') {
                    if(canvas.id !== 'visualizerAlbumCoverCanvas') {
                        canvas = document.getElementById('visualizerAlbumCoverCanvas');
                        ctx = canvas.getContext('2d');
                    }
                    if(globals.visualizer.circleEnabled === true) visualizerCircle(ctx);
                    else visualizerNavbar(ctx);
                }
            }

            requestAnimationFrame(renderFrame);
        }
        renderFrame();
    }

    const configCSS =
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
@-moz-document url-prefix() {
    #cfgHolder {
    overflow-y: scroll;
    }
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
}`;

    const fieldTexts = {
        lang: { english: 'Language<span title="Refresh for changes">🔄</span>', hungarian: 'Nyelv<span title="Frissíts a változásokhoz">🔄</span>' },
        langSection: { english: 'Utilities', hungarian: 'Hasznosságok' },
        noAfk: { english: 'Never AFK', hungarian: 'Sosem AFK' },
        noPromo: { english: 'No Promotions', hungarian: 'Promóciók kikapcsolása' },
        skipDisliked: { english: 'Skip Disliked Songs', hungarian: 'Nem kedvelt dalok kihagyása' },
        padding: { english: 'Fix Layout<span title="Refresh for changes">🔄</span>', hungarian: 'Elrendezés javítása<span title="Frissíts a változásokhoz">🔄</span>' },
        extraButtons: { english: 'Extra Playback Buttons', hungarian: 'Több Irányító Gomb' },
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
        visualizerStartsFromOptions: { english: ['Left', 'Center', 'Right', 'Edges'], hungarian: ['Bal', 'Közép', 'Jobb', 'Szélek'] },
        visualizerColor: { english: 'Visualizer Color', hungarian: 'Vizualizáló Színe' },
        visualizerRgbEnabled: { english: 'RGB Mode', hungarian: 'RGB Mód' },
        visualizerFade: { english: 'Enable Bar Fade', hungarian: 'Sávok Áttűnésének Engedélyezése' },
        visualizerFft: { english: 'Bar Amount<span title="High values can affect performance and can break circle visualizer.">⚠️</span>', hungarian: 'Sáv mennyiség<span title="A magas értékek befolyásolhatják a teljesítményt és hibát okozhatnak a kör vizualizálóban.">⚠️</span>' },
        visualizerCircleEnabled: { english: 'Enable (Album Cover Only)', hungarian: 'Engedélyez (Csak Album Borítón)' },
        visualizerCircleEnabledSection: { english: 'Circle Visualizer', hungarian: 'Kör Vizualizáló' },
        visualizerRotate: { english: 'Rotation', hungarian: 'Forgás' },
        visualizerRotateDirection: { english: 'Rotation Direction', hungarian: 'Forgásirány' },
        visualizerMove: { english: 'Bars Movement Direction', hungarian: 'Sávok Mozgásiránya' },
        visualizerBassBounceEnabled: { english: 'Bass Bounce', hungarian: 'Basszusugrálás' },
        visualizerBassBounceSmooth: { english: 'Smooth Bounce', hungarian: 'Ugrálás Simítása' },
        attention1: { english: 'Changes here can cause glitches!', hungarian: 'Az itteni változtatások hibákat okozhatnak!' },
        attention1Section: { english: 'Advanced Visualizer Settings', hungarian: 'Speciális Vizualizáló Beállítások' },
        visualizerRgbRed: { english: 'RGB:Red Value', hungarian: 'RGB:Piros Érték' },
        visualizerRgbGreen: { english: 'RGB:Green Value', hungarian: 'RGB:Zöld Érték' },
        visualizerRgbBlue: { english: 'RGB:Blue Value', hungarian: 'RGB:Kék Érték' },
        visualizerRgbSamples: { english: 'RGB:Samples', hungarian: 'RGB:Minták' },
        visualizerMinDecibels: { english: 'Min Decibels', hungarian: 'Min Decibel' },
        visualizerMaxDecibels: { english: 'Max Decibels', hungarian: 'Max Decibel' },
        visualizerSmoothing: { english: 'Smoothing Time Constant', hungarian: 'Simítási időállandó' },
        visualizerCutOff: { english: 'AudioData End Cutoff', hungarian: 'AudioData Vég Levágás' },
        visualizerBassBounceSensitivityStart: { english: 'Bass Bounce Sensitivity Start', hungarian: 'Basszusugrálás Érzékenység Kezdőérték' },
        visualizerBassBounceSensitivityEnd: { english: 'Bass Bounce Sensitivity End', hungarian: 'Basszusugrálás Érzékenység Végérték' },
        visualizerBassBounceDebug: { english: 'Bass Bounce Debug Color', hungarian: 'Basszusugrálás Debug Szín' },
    };

    let langOption = GM_getValue('ytmPlusCfg', 'english');
    if(langOption != 'english') {
        langOption = JSON.parse(langOption).lang;
        if(!langOption) langOption = 'english';
        else langOption = langOption.charAt(0).toLowerCase() + langOption.slice(1);
    }

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
        section0: {
            type: 'hidden',
            value: 'open',
            default: 'open'
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
        section1: {
            type: 'hidden',
            value: 'open',
            default: 'open'
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
        section2: {
            type: 'hidden',
            value: 'open',
            default: 'open'
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
        section3: {
            type: 'hidden',
            value: 'open',
            default: 'open'
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
            default: 'Both Sides'
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
        section4: {
            type: 'hidden',
            value: 'open',
            default: 'open'
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
        section5: {
            type: 'hidden',
            value: 'closed',
            default: 'closed'
        }
    };

    function openEvent(doc, win, frame) { // open function is mostly customizing settings UI
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

        globals.settingsOpen = true;
    }

    function closeEvent() {
        globals.settingsOpen = false;
    }

    function saveEvent() {
        // Updates updateable stuff on save
        if(GM_config.get('bg') == false) {
            document.body.style.backgroundColor = '#000000';
            document.body.style.backgroundImage = '';
            globals.playerPageDiv.style.backgroundColor = '#000000';
            globals.playerPageDiv.style.backgroundImage = '';
        }
        else {
            try {
                document.getElementsByClassName('immersive-background style-scope ytmusic-browse-response')[0].children[0].remove();
            }
            catch { }
            document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';
            addFancy(document.body.style, true);
            addFancy(globals.playerPageDiv.style);
        }

        clockEnable(GM_config.get('clock'));

        afkEnable(GM_config.get('noAfk'));

        promoEnable(GM_config.get('noPromo'));

        skipDisliked(GM_config.get('skipDisliked'));

        extraButtons(GM_config.get('extraButtons'));

        if(GM_config.get('visualizerPlace') != 'Disabled') {
            if(globals.visualizer.analyser === undefined) getVideo();
            else {
                globals.visualizer.initValues();
                globals.visualizer.getBufferData();
            }
        }
        else globals.visualizer.place = 'Disabled';
        if(globals.visualizer.rgb.enabled) globals.visualizer.getRGB();
        window.dispatchEvent(new Event('resize'));
    }

    // 'type': 'color'; just results in a text input, they are later converted to actual color input, see open event

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

    function keydownEvent(ev) {
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

    function loadEvent() {
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

    window.addEventListener('keydown', (ev) => keydownEvent(ev));

    window.addEventListener('load', () => loadEvent());
})();
