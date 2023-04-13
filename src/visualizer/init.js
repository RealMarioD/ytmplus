import { globals, visualizer } from '../globals';
import { logplus } from '../debug';
import { visualizerCircle } from './circle';
import { replaceImageURL } from './image';
import { visualizerNavbar } from './navbar';

export let video;
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

    replaceImageURL();
    requestAnimationFrame(renderFrame);
}

export function visualizerResizeFix() {
    switch(visualizer.place) {
        case 'Navbar': default: {
            if(canvas.width !== globals.navBarBg.offsetWidth) canvas.width = globals.navBarBg.offsetWidth;
            if(canvas.height !== globals.navBarBg.offsetHeight) canvas.height = globals.navBarBg.offsetHeight;
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
        }
        case 'Album Cover': {
            if(canvas.width !== globals.player.offsetWidth) canvas.width = globals.player.offsetWidth;
            if(canvas.height !== globals.player.offsetHeight) canvas.height = globals.player.offsetHeight;
            canvas.style.width = globals.player.offsetWidth + 'px';
            canvas.style.height = globals.player.offsetHeight + 'px';
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
        }
        case 'Disabled': break;
    }
}

let lastFrameTime = 0;
export function renderFrame(time) { // Never remove time var from here
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

export function getBarColor(i) {
    if(visualizer.rgb.enabled === true) {
        const color = ~~(i / visualizer.colorDivergence); // Limits iteration for rgb._data, so we don't go out of bounds but also use every color available
        if(visualizer.fade === true) ctx.fillStyle = `rgba(${visualizer.rgb._data[color].red}, ${visualizer.rgb._data[color].green}, ${visualizer.rgb._data[color].blue}, ${visualizer.audioData[i] < 128 ? visualizer.audioData[i] * 2 / 255 : 1.0})`;
        else ctx.fillStyle = `rgb(${visualizer.rgb._data[color].red}, ${visualizer.rgb._data[color].green}, ${visualizer.rgb._data[color].blue})`;
    }
    else if(visualizer.fade === true) ctx.fillStyle = visualizer.color + (visualizer.audioData[i] < 128 ? (visualizer.audioData[i] * 2).toString(16) : 'FF');
    else ctx.fillStyle = visualizer.color;

    if(visualizer.bassBounce.debug === true && i <= visualizer.bassBounce._barEnd && i >= visualizer.bassBounce._barStart) ctx.fillStyle = '#FFF';
}