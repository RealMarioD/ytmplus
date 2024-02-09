import { elements } from '../../globals/elements';
import { visualizer } from '../../globals/visualizer';
import { visualizerCircle } from './circle';
import { visualizerNavbar } from './navbar.js';

let lastFrameTime = 0;

// NEVER REMOVE TIME const FROM HERE DESPITE THE FACT THE **WE** NEVER CALL IT, BROWSERS DO (OR SOMETHING LIKE THAT)
export function renderFrame(time) {
    // If player is in fullscreen, hide playlist, TODO: put it in a mutation observer
    if(elements.player.playerUiState !== 'FULLSCREEN' && elements.playlist.style.visibility !== 'visible') elements.playlist.style.visibility = 'visible'; // .removeProperty('visibility');
    else if(elements.player.playerUiState === 'FULLSCREEN' && elements.playlist.style.visibility !== 'hidden') elements.playlist.style.visibility = 'hidden';

    // Don't do anything if True Pause energy saver is on and playback is paused
    if((visualizer.energySaver.type === 'True Pause' || visualizer.energySaver.type === 'Both') && visualizer.video.paused === true) return requestAnimationFrame(renderFrame);

    // If render would be faster than max fps (60 by default if energy saver is off) come back later
    if(time - lastFrameTime < visualizer.energySaver._frameMinTime) return requestAnimationFrame(renderFrame);

    lastFrameTime = time;

    visualizer.ctx.clearRect(0, 0, visualizer.values.WIDTH, visualizer.values.HEIGHT);

    // Kill everything if disabled, can be turned back with requestAnimationFrame(renderFrame), see settignsMenu/events.js --> saveEvent()
    if(visualizer.place === 'Disabled') return;

    // Get audio data
    visualizer.analyser.getByteFrequencyData(visualizer.audioData);

    // Normalize audio data to 0 - 1
    for(let i = 0; i < visualizer.audioData.length; i++) visualizer.normalizedAudioData[i] = visualizer.audioData[i] / 255;

    // Cheap color cycle effect, speed scales with fps so probably not the best
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
        if(elements.player.playerUiState === 'MINIPLAYER') {
            if(visualizer.canvas.id !== visualizer.canvases.background.id) {
                visualizer.canvas = visualizer.canvases.background;
                visualizer.ctx = visualizer.canvas.getContext('2d');
                console.log('Switched visualizer.canvas to background');
            }
        }
        else if(elements.player.playerUiState === 'FULLSCREEN') {
            // playerBackground canvas height is not 100vh because YTM is a piece of fucking shit and my brain doesn't let me "hide" the bottom of the canvas under the miniplayer thing
            // so to not have to fuck with scaling, we just switch to the already perfectly scaled album cover, EZ Clap
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

    if(visualizer.circleEnabled === true && visualizer.canvas.id !== visualizer.canvases.navbar.id) visualizerCircle(visualizer.ctx);
    else visualizerNavbar(visualizer.ctx);

    requestAnimationFrame(renderFrame);
}

