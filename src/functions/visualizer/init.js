import { elements } from '../../globals/elements';
import { visualizer } from '../../globals/visualizer';
import { injectElement } from '../backend/injectElement';
import { replaceImageURL } from './image';
import { renderFrame } from './renderer';
import { getBufferData, initValues, visualizerResizeFix } from './utils';

export async function setupVisualizer() {
    // Injecting visualizer visualizer.canvases
    visualizer.canvases.navbar = await injectElement('canvas', 'visualizerNavbarCanvas', elements.navBarBg, undefined, 'position: absolute; left: 0; top: 0; width: inherit; height: inherit; pointer-events: none;');
    visualizer.canvases.albumCover = await injectElement('canvas', 'visualizerAlbumCoverCanvas', elements.player, undefined, 'position: absolute; z-index: 9999; pointer-events: none; visibility: visible; width: 100%; height: 100%;', true);
    elements.navBarBg.style.opacity = 1;

    // 64px is navbar, 72px is bottom player controls
    visualizer.canvases.background = await injectElement('canvas', 'visualizerBackgroundCanvas', document.getElementById('content'), undefined, 'position: fixed; z-index: -1; pointer-events: none; visibility: visible; width: 100%; height: calc(100vh - (64px + 72px)); margin-top: 64px;', true);
    visualizer.canvases.playerBackground = await injectElement('canvas', 'visualizerPlayerBackgroundCanvas', document.getElementById('player-page'), undefined, 'position: absolute; z-index: -1; pointer-events: none; visibility: visible; width: inherit; height: inherit;', true);
    getVideo();
}

export function getVideo() {
    visualizer.video = document.querySelector('video');
    if(visualizer.video) {
        visualizer.video.style.position = 'static'; // i guess it fixes videos being offset when refreshing a video (??????)
        startVisualizer();
    }
    else {
        console.warn('Query "video" not found, retrying in 100ms.');
        setTimeout(getVideo, 100);
    }
}

export function startVisualizer() {
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