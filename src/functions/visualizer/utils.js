import { elements } from '../../globals/elements';
import { visualizer } from '../../globals/visualizer';
import { ytmpConfig } from '../../ytmpConfig';

export function getFMT(fps) {
    visualizer.energySaver._frameMinTime = (1000 / 60) * (60 / fps) - (1000 / 60) * 0.5;
}

export function calculateBassBounceBars() {
    visualizer.bassBounce._barStart = ~~(visualizer.bassBounce.minHertz / visualizer.audioDataStep);
    visualizer.bassBounce._barEnd = ~~(visualizer.bassBounce.maxHertz / visualizer.audioDataStep);
    if(visualizer.bassBounce._barEnd === 0) visualizer.bassBounce._barEnd++;
}

export function getBufferData() {
    visualizer.analyser.fftSize = ytmpConfig.get('visualizerFft');
    visualizer.minHertz = ytmpConfig.get('visualizerMinHertz');
    visualizer.maxHertz = ytmpConfig.get('visualizerMaxHertz');
    visualizer.bufferLength = visualizer.analyser.frequencyBinCount; // bufferLength is fftSize / 2, means how much data we will have in audioData
    visualizer.audioDataStep = visualizer.audioContext.sampleRate / visualizer.analyser.fftSize; // 1 step = 1 audio data Hz range
    // e.g.: FFT = 4096, sampleRate = 48000 | 48000 / 4096 = ~21.5Hz, audioData[0] would contain 0Hz -> 21.5Hz of audio
    visualizer.removedBeginning = ~~(visualizer.minHertz / visualizer.audioDataStep);
    visualizer.removedEnding = ~~(visualizer.maxHertz / visualizer.audioDataStep);
    visualizer.audioDataLength = visualizer.removedEnding - visualizer.removedBeginning;
    visualizer.audioData = new Uint8Array(visualizer.bufferLength);
}

/**
 * Visualizer keys must have identical names with their GM_config equivalent, e.g.: visualizer.place = 'visualizerPlace'
 * Following this rule we can iterate through the visualizer object and automatically get all configs and their visualizer.values.
 * (bassBounce is the last thing it checks so any visualizer.values that should be initialised/changed upon saving should be set above bassBounce)
 */
export function initValues() {
    for(const key in visualizer) {
        let gmName;

        if(typeof visualizer[key] !== 'object') {
            gmName = 'visualizer' + key[0].toUpperCase() + key.slice(1, key.length); // e.g.: visualizer + P + lace
            visualizer[key] = ytmpConfig.get(gmName);
            continue;
        }

        for(const key2 in visualizer[key]) {
            if(key2[0] === '_') continue;
            gmName = 'visualizer' +
           key[0].toUpperCase() + key.slice(1, key.length) + // B + assBounce
           key2[0].toUpperCase() + key2.slice(1, key2.length); // E + nabled

            visualizer[key][key2] = ytmpConfig.get(gmName);
        }

        if(key !== 'bassBounce') continue;

        // Last things to do (everything here runs only once)
        if(visualizer.analyser !== undefined) {
            visualizer.analyser.smoothingTimeConstant = ytmpConfig.get('visualizerSmoothing');
            visualizer.analyser.minDecibels = ytmpConfig.get('visualizerMinDecibels');
            visualizer.analyser.maxDecibels = ytmpConfig.get('visualizerMaxDecibels');
            calculateBassBounceBars();
        }

        visualizer.colorDivergence = visualizer.audioDataLength / visualizer.rgb.samples;
        if(visualizer.rgb.enabled === true && visualizer.rgb._data.length !== visualizer.rgb.samples) getRGB();

        if(visualizer.energySaver.type === 'Limit FPS' || visualizer.energySaver.type === 'Both') getFMT(visualizer.energySaver.fps);
        else getFMT(60);

        clearInterval(visualizer.resizeInterval);
        if(visualizer.place !== 'Disabled') visualizer.resizeInterval = setInterval(() => visualizerResizeFix(), 1000);
        return; // So we don't check anything beyond bassBounce
    }
}

// Pregenerates RGB colors so we don't have to calculate colors every frame
function getRGB() {
    const hue = 2 * Math.PI / visualizer.rgb.samples,
        piD3 = Math.PI / 3, // Offset
        piD3x2 = 2 * Math.PI / 3; // so that colors aren't totally mixed together

    visualizer.rgb._data = [];
    for(let i = 0; i < visualizer.rgb.samples; i++) {
        visualizer.rgb._data[i] = {
            red: Math.abs(visualizer.rgb.red * Math.sin(i * hue)),
            green: Math.abs(visualizer.rgb.green * Math.sin(i * hue + piD3)),
            blue: Math.abs(visualizer.rgb.blue * Math.sin(i * hue + piD3x2))
        };
    }
}

export function visualizerResizeFix() {
    let currentCanvasHolder;
    switch(visualizer.canvas.id) {
        case visualizer.canvases.navbar.id: currentCanvasHolder = elements.navBarBg; break;
        case visualizer.canvases.albumCover.id: currentCanvasHolder = elements.player; break;
        case visualizer.canvases.playerBackground.id: currentCanvasHolder = visualizer.canvases.playerBackground; break;
        case visualizer.canvases.background.id: currentCanvasHolder = visualizer.canvases.background; break;
        default: throw new Error('visualizer.canvas.id is not valid!');
    }

    if(visualizer.canvas.width !== currentCanvasHolder.offsetWidth * visualizer.renderScale) visualizer.canvas.width = currentCanvasHolder.offsetWidth * visualizer.renderScale;
    if(visualizer.canvas.height !== currentCanvasHolder.offsetHeight * visualizer.renderScale) visualizer.canvas.height = currentCanvasHolder.offsetHeight * visualizer.renderScale;

    if(elements.player.playerUiState_ === 'FULLSCREEN' && visualizer.canvas.id !== visualizer.canvases.navbar.id) elements.playlist.style.opacity = '0.01';
    else elements.playlist.style.opacity = '';

    visualizer.values.WIDTH = visualizer.canvas.width;
    visualizer.values.halfWidth = visualizer.values.WIDTH / 2;
    visualizer.values.HEIGHT = visualizer.canvas.height;
    visualizer.values.halfHeight = visualizer.values.HEIGHT / 2;

    // Fixes visualizer offset / Fixes album cover getting incosistent sizes if moved to different resolution displays
    // Commented out because it breaks more shit than it fixes
    // elements.player.style.margin = 'auto 0px';

    if(visualizer.circleEnabled === true && visualizer.canvas.id !== visualizer.canvases.navbar.id) {
        if(visualizer.bassBounce.enabled === true) {
            visualizer.values.minRadius = ~~(visualizer.values.HEIGHT / 5);
            visualizer.values.maxRadius = ~~(visualizer.values.HEIGHT / 3);
        }
        else {
            visualizer.values.radius = ~~(visualizer.values.HEIGHT / 4);
            visualizer.values.maxRadius = visualizer.values.radius;
        }

        visualizer.values.barTotal = visualizer.values.circleSize * Math.PI / (visualizer.audioDataLength - 2 + visualizer.values.circleSize);
        visualizer.values.barWidth = visualizer.values.barTotal * 0.45;
    }
    else {
        if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') visualizer.values.barTotal = visualizer.values.halfWidth / visualizer.audioDataLength;
        else visualizer.values.barTotal = visualizer.values.WIDTH / visualizer.audioDataLength;
        visualizer.values.barSpace = visualizer.values.barTotal * 0.05;
        visualizer.values.barWidth = visualizer.values.barTotal * 0.95;
    }
}

export function averageOfArray(numbers) {
    let result = 0;
    for(let i = 0; i < numbers.length; i++) result += numbers[i];
    return result / numbers.length;
}

export function getBarColor(i) {
    if(visualizer.bassBounce.debug === true && i <= visualizer.bassBounce._barEnd && i >= visualizer.bassBounce._barStart) return visualizer.ctx.fillStyle = '#FFF';
    i -= visualizer.removedBeginning;
    if(visualizer.rgb.enabled === true) {
        // Limits iteration for rgb._data, so we don't go out of bounds but also use every color available
        const colors = visualizer.rgb._data[~~(i / visualizer.colorDivergence)];

        if(visualizer.fade === true) visualizer.ctx.fillStyle = `rgba(${colors.red}, ${colors.green}, ${colors.blue}, ${visualizer.audioData[i] < 128 ? visualizer.audioData[i] * 2 / 255 : 1.0})`;
        else visualizer.ctx.fillStyle = `rgb(${colors.red}, ${colors.green}, ${colors.blue})`;
    }
    else if(visualizer.fade === true) visualizer.ctx.fillStyle = visualizer.color + (visualizer.audioData[i] < 128 ? (visualizer.audioData[i] * 2).toString(16) : 'FF');
    else visualizer.ctx.fillStyle = visualizer.color;
}

export function calculateBass() {
    visualizer.values.bass = visualizer.normalizedAudioData.slice(visualizer.bassBounce._barStart, visualizer.bassBounce._barEnd);

    const maxAddedRadius = visualizer.values.maxRadius - visualizer.values.minRadius;

    visualizer.values.bassSmoothRadius = averageOfArray(visualizer.values.bass);

    const maxBassValue = 1 - visualizer.bassBounce.threshold;

    if(visualizer.bassBounce.enabled === true) {
        if(visualizer.values.bassSmoothRadius < visualizer.bassBounce.threshold) return visualizer.values.radius = (visualizer.values.radius + visualizer.values.minRadius) / 2;

        visualizer.values.radius = (visualizer.values.radius + (visualizer.values.minRadius + (visualizer.values.bassSmoothRadius - visualizer.bassBounce.threshold) / maxBassValue * maxAddedRadius)) / 2;
    }
}

export function getRotationValue() {
    const direction = (visualizer.rotateDirection === 'Clockwise') ? 1 : -1;

    switch(visualizer.rotate) {
        case 'Disabled': default: { visualizer.values.rotationValue = 0; } break;
        case 'On': { visualizer.values.rotationValue += 0.005 * direction; } break;
        case 'Reactive': { visualizer.values.rotationValue += (Math.pow(averageOfArray(visualizer.audioData) / 10000 + 1, 2) - 1) * direction; } break;
        case 'Reactive (Bass)': { visualizer.values.rotationValue += (Math.pow(visualizer.values.bassSmoothRadius / 10000 + 1, 2) - 1) * direction; } break;
    }
}