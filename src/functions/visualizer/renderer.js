import { elements } from '../../globals/elements';
import { visualizer } from '../../globals/visualizer';
import { visualizerCircle } from './circle';
import { visualizerNavbar } from './navbar';

let lastFrameTime = 0;

// NEVER REMOVE TIME VAR FROM HERE
export function renderFrame(time) {
    // Don't do anything if True Pause energy saver is on and playback is paused
    if((visualizer.energySaver.type === 'True Pause' || visualizer.energySaver.type === 'Both') && visualizer.video.paused === true) return requestAnimationFrame(renderFrame);

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

    // Check if canvas corresponds to selected place
    if(visualizer.place === 'Navbar' && visualizer.canvas.id !== visualizer.canvases.navbar.id) {
        visualizer.canvas = visualizer.canvases.navbar;
        visualizer.ctx = visualizer.canvas.getContext('2d');
    }
    else if(visualizer.place === 'Album Cover' && visualizer.canvas.id !== visualizer.canvases.albumCover.id) {
        visualizer.canvas = visualizer.canvases.albumCover;
        visualizer.ctx = visualizer.canvas.getContext('2d');
    }
    else if(visualizer.place === 'Background') {
        if(elements.player.playerUiState_ === 'MINIPLAYER') {
            if(visualizer.canvas.id !== visualizer.canvases.background.id) {
                visualizer.canvas = visualizer.canvases.background;
                visualizer.ctx = visualizer.canvas.getContext('2d');
                console.log('Switched visualizer.canvas to background');
            }
        }
        else if(elements.player.playerUiState_ === 'FULLSCREEN') {
            if(visualizer.canvas.id !== visualizer.canvases.albumCover.id) {
                visualizer.canvas = visualizer.canvases.albumCover;
                visualizer.ctx = visualizer.canvas.getContext('2d');
                console.log('Switched visualizer.canvas to albumCover');
            }
        }
        else if(visualizer.canvas.id !== visualizer.canvases.playerBackground.id) {
            visualizer.canvas = visualizer.canvases.playerBackground;
            visualizer.ctx = visualizer.canvas.getContext('2d');
            console.log('Switched visualizer.canvas to playerBackground');
        }
    }

    if(visualizer.circleEnabled === true) visualizerCircle(visualizer.ctx);
    else visualizerNavbar(visualizer.ctx);

    requestAnimationFrame(renderFrame);
}