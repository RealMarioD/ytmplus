import { visualizer } from '../../globals/visualizer';
import { visualizerCircle } from './circle';
import { visualizerNavbar } from './navbar.js';

let lastFrameTime = 0;

// NEVER REMOVE TIME FROM HERE DESPITE THE FACT THE **WE** NEVER CALL IT, BROWSERS DO (OR SOMETHING LIKE THAT)
export function renderFrame(time) {
    // Don't do anything if True Pause energy saver is on and playback is paused
    if((visualizer.energySaver.type === 'True Pause' || visualizer.energySaver.type === 'Both') && visualizer.video.paused === true) return requestAnimationFrame(renderFrame);

    // If render would be faster than max fps (60 by default if energy saver is off) come back later
    if(time - lastFrameTime < visualizer.energySaver._frameMinTime) return requestAnimationFrame(renderFrame);

    lastFrameTime = time;

    visualizer.ctx.clearRect(0, 0, visualizer.values.WIDTH, visualizer.values.HEIGHT);

    // Kill everything if disabled, can be turned back by simply calling requestAnimationFrame(renderFrame)
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

    if(visualizer.circleEnabled === true && visualizer.canvas.id !== visualizer.canvases.navbar.id) visualizerCircle(visualizer.ctx);
    else visualizerNavbar(visualizer.ctx);

    requestAnimationFrame(renderFrame);
}

