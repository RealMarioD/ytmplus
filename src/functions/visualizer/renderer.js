import { visualizer } from '../../globals/visualizer';
import { visualizerCircle } from './circle';
import { visualizerNavbar } from './navbar.js';

let lastFrameTime = 0;

/**
 * Process audio data with optional logarithmic mapping and exponential scaling
 */
function processAudioData() {
    const audioData = visualizer.audioData;
    const normalized = visualizer.normalizedAudioData;
    const len = audioData.length;

    if(visualizer.logarithmicMapping === true) {
        const mapping = visualizer.logMapping;
        // Logmapping with exponential scaling
        if(visualizer.exponentialScaling === true) {
            const exponent = visualizer.exponentialScalingFactor;
            for(let i = 0; i < len; i++) {
                const v1 = audioData[mapping.index1[i]];
                const v2 = audioData[mapping.index2[i]];
                const linearValue = (v1 + (v2 - v1) * mapping.fraction[i]) / 255;
                normalized[i] = Math.pow(linearValue, exponent);
            }
        }
        else { // Logmapping without exponential scaling
            for(let i = 0; i < len; i++) {
                const v1 = audioData[mapping.index1[i]];
                const v2 = audioData[mapping.index2[i]];
                normalized[i] = (v1 + (v2 - v1) * mapping.fraction[i]) / 255;
            }
        }
    }
    else if(visualizer.exponentialScaling === true) {
        // Linear mapping with exponential scaling
        const exponent = visualizer.exponentialScalingFactor;
        for(let i = 0; i < len; i++) {
            const linearValue = audioData[i] / 255;
            normalized[i] = Math.pow(linearValue, exponent);
        }
    }
    else for(let i = 0; i < len; i++) normalized[i] = audioData[i] / 255; // Original linear mapping
}

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

    // Process audio data (logarithmic mapping and/or exponential scaling)
    processAudioData();

    // Cheap color cycle effect, speed scales with fps so probably not the best
    if(visualizer.rgb.enabled === true) {
        visualizer.rgb._data.push(visualizer.rgb._data[0]);
        visualizer.rgb._data.shift();
    }

    if(visualizer.circleEnabled === true && visualizer.canvas.id !== visualizer.canvases.navbar.id) visualizerCircle(visualizer.ctx);
    else visualizerNavbar(visualizer.ctx);

    requestAnimationFrame(renderFrame);
}

