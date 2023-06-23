import { elements } from '../../globals/elements';
import { visualizer } from '../../globals/visualizer';
import { injectElement } from '../backend/injectElement';
import { visualizerCircle } from './circle';
import { replaceImageURL } from './image';
import { visualizerNavbar } from './navbar';
import { getBufferData, initValues, visualizerResizeFix } from './utils';

export async function setupVisualizer() {
    // Injecting visualizer visualizer.canvases
    visualizer.canvases.navbar = await injectElement('canvas', 'visualizerNavbarCanvas', elements.navBarBg, undefined, 'position: absolute; left: 0; top: 0; width: inherit; height: inherit; pointer-events: none;');
    visualizer.canvases.albumCover = await injectElement('canvas', 'visualizerAlbumCoverCanvas', elements.player, undefined, 'position: absolute; z-index: 9999; pointer-events: none; visibility: visible; width: 100%; height: 100%;', true);
    elements.navBarBg.style.opacity = 1;

    // 64px is navbar, 72px is bottom player controls
    visualizer.canvases.background = await injectElement('canvas', 'visualizerBackgroundCanvas', document.getElementById('content'), undefined, 'position: fixed; pointer-events: none; visibility: visible; width: 100%; height: calc(100vh - (64px + 72px)); margin-top: 64px;', true);
    visualizer.canvases.playerBackground = await injectElement('canvas', 'visualizerPlayerBackgroundCanvas', document.getElementById('player-page'), undefined, 'position: absolute; pointer-events: none; visibility: visible; width: inherit; height: inherit;', true);
    getVideo();
}

let video;
export function getVideo() {
    video = document.querySelector('video');
    if(video) startVisualizer();
    else {
        console.warn('Query "video" not found, retrying in 100ms.');
        setTimeout(getVideo, 100);
    }
}

export function startVisualizer() {
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
export function renderFrame(time) {
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