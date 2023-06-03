import { globals, visualizer } from '../globals';
import { logplus } from '../debug';
import { visualizerCircle } from './circle';
import { replaceImageURL } from './image';
import { visualizerNavbar } from './navbar';
import { GM_config } from '../GM/GM_config';
import { injectElement } from '../utils';

const canvases = {
    navbar: undefined,
    albumCover: undefined,
    background: undefined,
    playerBackground: undefined
};
export async function setupVisualizer() {
    // Injecting visualizer canvases
    canvases.navbar = await injectElement('canvas', 'visualizerNavbarCanvas', globals.navBarBg, document, 'position: absolute; left: 0; top: 0; width: inherit; height: inherit; pointer-events: none;');
    canvases.albumCover = await injectElement('canvas', 'visualizerAlbumCoverCanvas', globals.player, document, 'position: absolute; z-index: 9999; pointer-events: none; visibility: visible; width: inherit; height: inherit;', true);
    globals.navBarBg.style.opacity = 1;

    // 64px is navbar, 72px is bottom player controls
    canvases.background = await injectElement('canvas', 'visualizerBackgroundCanvas', document.getElementById('content'), document, 'position: fixed; pointer-events: none; visibility: visible; width: 100%; height: calc(100vh - (64px + 72px)); margin-top: 64px;', true);
    canvases.playerBackground = await injectElement('canvas', 'visualizerPlayerBackgroundCanvas', document.getElementById('player-page'), document, 'position: absolute; pointer-events: none; visibility: visible; width: inherit; height: inherit;', true);
    if(GM_config.get('visualizerPlace') !== 'Disabled') getVideo();
}

let video;
export function getVideo() {
    video = document.querySelector('video');
    if(video) startVisualizer();
    else {
        logplus('warn', 'Query "video" not found, retrying in 100ms.');
        setTimeout(getVideo, 100);
    }
}

export const values = {
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

export let canvas, ctx;

export function startVisualizer() {
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

    // Helps set the canvas resolution to the correct size
    visualizer.resizeInterval = setInterval(() => {
        visualizerResizeFix();
    }, 1000);

    window.addEventListener('resize', visualizerResizeFix);

    replaceImageURL();
    requestAnimationFrame(renderFrame);
}

export function visualizerResizeFix() {
    switch(canvas.id) {
        case canvases.navbar.id: {
            if(canvas.width !== globals.navBarBg.offsetWidth) canvas.width = globals.navBarBg.offsetWidth;
            if(canvas.height !== globals.navBarBg.offsetHeight) canvas.height = globals.navBarBg.offsetHeight;
            break;
        }
        case canvases.albumCover.id: {
            if(canvas.width !== globals.player.offsetWidth) canvas.width = globals.player.offsetWidth;
            if(canvas.height !== globals.player.offsetHeight) canvas.height = globals.player.offsetHeight;

            // // if miniplayer == true
            // if(globals.player.playerPageOpen_ === false) {
            //     // move the canvas over the miniplayer
            //     canvas.style.bottom = getComputedStyle(globals.player).bottom;
            //     canvas.style.left = getComputedStyle(globals.player).left;
            // }
            // else {
            //     // completely remove properties because html
            //     if(canvas.style.bottom !== '') canvas.style.removeProperty('bottom');
            //     if(canvas.style.left !== '') canvas.style.removeProperty('left');
            // }
            break;
        }
        case canvases.playerBackground.id: {
            if(canvas.width !== canvases.playerBackground.offsetWidth) canvas.width = canvases.playerBackground.offsetWidth;
            if(canvas.height !== canvases.playerBackground.offsetHeight) canvas.height = canvases.playerBackground.offsetHeight;
            break;
        }
        case canvases.background.id: {
            if(canvas.width !== canvases.background.offsetWidth) canvas.width = canvases.background.offsetWidth;
            if(canvas.height !== canvases.background.offsetHeight) canvas.height = canvases.background.offsetHeight;
            break;
        }
        default: break;
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

// Never remove time var from here
export function renderFrame(time) {
    // Don't do anything if True Pause energy saver is on and playback is paused
    if((visualizer.energySaver.type === 'True Pause' || visualizer.energySaver.type === 'Both') && video.paused === true) return requestAnimationFrame(renderFrame);

    // If render would be faster than max fps (60 by default if energy saver is off) come back later
    if(time - lastFrameTime < visualizer.energySaver._frameMinTime) return requestAnimationFrame(renderFrame);
    lastFrameTime = time;

    ctx.clearRect(0, 0, values.WIDTH, values.HEIGHT);

    // Kill everything if disabled, can be turned back with requestAnimationFrame(renderFrame), see GM's save event
    if(visualizer.place === 'Disabled') return;

    // Get audio data
    visualizer.analyser.getByteFrequencyData(visualizer.audioData);

    // Color cycle effect
    if(visualizer.rgb.enabled === true) {
        visualizer.rgb._data.push(visualizer.rgb._data[0]);
        visualizer.rgb._data.shift();
    }

    if(visualizer.place === 'Navbar') {
        if(canvas.id !== canvases.navbar.id) {
            canvas = canvases.navbar;
            ctx = canvas.getContext('2d');
        }
        visualizerNavbar(ctx);
    }
    else if(visualizer.place === 'Album Cover') {
        if(canvas.id !== canvases.albumCover.id) {
            canvas = canvases.albumCover;
            ctx = canvas.getContext('2d');
        }
        if(visualizer.circleEnabled === true) visualizerCircle(ctx);
        else visualizerNavbar(ctx);
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
        if(visualizer.circleEnabled === true) visualizerCircle(ctx);
        else visualizerNavbar(ctx);
    }

    requestAnimationFrame(renderFrame);
}

export function getBarColor(i) {
    if(visualizer.rgb.enabled === true) {
        // Limits iteration for rgb._data, so we don't go out of bounds but also use every color available
        const color = ~~(i / visualizer.colorDivergence);

        if(visualizer.fade === true) ctx.fillStyle = `rgba(${visualizer.rgb._data[color].red}, ${visualizer.rgb._data[color].green}, ${visualizer.rgb._data[color].blue}, ${visualizer.audioData[i] < 128 ? visualizer.audioData[i] * 2 / 255 : 1.0})`;
        else ctx.fillStyle = `rgb(${visualizer.rgb._data[color].red}, ${visualizer.rgb._data[color].green}, ${visualizer.rgb._data[color].blue})`;
    }
    else if(visualizer.fade === true) ctx.fillStyle = visualizer.color + (visualizer.audioData[i] < 128 ? (visualizer.audioData[i] * 2).toString(16) : 'FF');
    else ctx.fillStyle = visualizer.color;

    if(visualizer.bassBounce.debug === true && i <= visualizer.bassBounce._barEnd && i >= visualizer.bassBounce._barStart) ctx.fillStyle = '#FFF';
}