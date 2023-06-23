import { elements } from '../../globals/elements';
import { visualizer } from '../../globals/visualizer';
import { ytmpConfig } from '../../ytmpConfig';

export function getFMT(fps) {
    visualizer.energySaver._frameMinTime = (1000 / 60) * (60 / fps) - (1000 / 60) * 0.5;
}

export function calculateBassBounceBars() {
    visualizer.bassBounce._barStart = ~~(visualizer.bassBounce.minHertz / (44100 / visualizer.analyser.fftSize));
    visualizer.bassBounce._barEnd = ~~(visualizer.bassBounce.maxHertz / (44100 / visualizer.analyser.fftSize));
    if(visualizer.bassBounce._barEnd === 0) visualizer.bassBounce._barEnd++;
}

export function getBufferData() {
    visualizer.analyser.fftSize = ytmpConfig.get('visualizerFft');
    visualizer.minHertz = ytmpConfig.get('visualizerMinHertz');
    visualizer.maxHertz = ytmpConfig.get('visualizerMaxHertz');
    visualizer.bufferLength = ~~((visualizer.maxHertz) / (44100 / visualizer.analyser.fftSize));
    visualizer.removedBeginning = visualizer.bufferLength - ~~((visualizer.maxHertz - visualizer.minHertz) / (44100 / visualizer.analyser.fftSize));
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

        visualizer.colorDivergence = visualizer.bufferLength / visualizer.rgb.samples;
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
    switch(visualizer.canvas.id) {
        case visualizer.canvases.navbar.id: {
            if(visualizer.canvas.width !== elements.navBarBg.offsetWidth) visualizer.canvas.width = elements.navBarBg.offsetWidth;
            if(visualizer.canvas.height !== elements.navBarBg.offsetHeight) visualizer.canvas.height = elements.navBarBg.offsetHeight;
            break;
        }
        case visualizer.canvases.albumCover.id: {
            if(visualizer.canvas.width !== elements.player.offsetWidth) visualizer.canvas.width = elements.player.offsetWidth;
            if(visualizer.canvas.height !== elements.player.offsetHeight) visualizer.canvas.height = elements.player.offsetHeight;
            break;
        }
        case visualizer.canvases.playerBackground.id: {
            if(visualizer.canvas.width !== visualizer.canvases.playerBackground.offsetWidth) visualizer.canvas.width = visualizer.canvases.playerBackground.offsetWidth;
            if(visualizer.canvas.height !== visualizer.canvases.playerBackground.offsetHeight) visualizer.canvas.height = visualizer.canvases.playerBackground.offsetHeight;
            break;
        }
        case visualizer.canvases.background.id: {
            if(visualizer.canvas.width !== visualizer.canvases.background.offsetWidth) visualizer.canvas.width = visualizer.canvases.background.offsetWidth;
            if(visualizer.canvas.height !== visualizer.canvases.background.offsetHeight) visualizer.canvas.height = visualizer.canvases.background.offsetHeight;
            break;
        }
        default: break;
    }

    visualizer.values.WIDTH = visualizer.canvas.width;
    visualizer.values.halfWidth = visualizer.values.WIDTH / 2;
    visualizer.values.HEIGHT = visualizer.canvas.height;
    visualizer.values.halfHeight = visualizer.values.HEIGHT / 2;

    // Fixes visualizer offset / Fixes album cover getting incosistent sizes if moved to different resolution displays
    // elements.player.style.margin = 'auto 0px';

    if(visualizer.circleEnabled === true && visualizer.canvas.id !== visualizer.canvases.navbar.id) {
        if(visualizer.bassBounce.enabled === false) {
            visualizer.values.radius = ~~(visualizer.values.HEIGHT / 4);
            visualizer.values.heightModifier = (visualizer.values.HEIGHT - visualizer.values.radius) / 2 / 255;
        }
        else visualizer.values.heightModifier = (visualizer.values.HEIGHT - ~~(visualizer.values.HEIGHT / 8)) / 2 / 255;

        visualizer.values.barTotal = visualizer.values.circleSize * Math.PI / ((visualizer.bufferLength - visualizer.removedBeginning) - 2 + visualizer.values.circleSize);
        visualizer.values.barWidth = visualizer.values.barTotal * 0.45;
    }
    else {
        if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') visualizer.values.barTotal = visualizer.values.halfWidth / (visualizer.bufferLength - visualizer.removedBeginning);
        else visualizer.values.barTotal = visualizer.values.WIDTH / (visualizer.bufferLength - visualizer.removedBeginning);
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
    if(visualizer.rgb.enabled === true) {
        // Limits iteration for rgb._data, so we don't go out of bounds but also use every color available
        const color = ~~(i / visualizer.colorDivergence);

        if(visualizer.fade === true) visualizer.ctx.fillStyle = `rgba(${visualizer.rgb._data[color].red}, ${visualizer.rgb._data[color].green}, ${visualizer.rgb._data[color].blue}, ${visualizer.audioData[i] < 128 ? visualizer.audioData[i] * 2 / 255 : 1.0})`;
        else visualizer.ctx.fillStyle = `rgb(${visualizer.rgb._data[color].red}, ${visualizer.rgb._data[color].green}, ${visualizer.rgb._data[color].blue})`;
    }
    else if(visualizer.fade === true) visualizer.ctx.fillStyle = visualizer.color + (visualizer.audioData[i] < 128 ? (visualizer.audioData[i] * 2).toString(16) : 'FF');
    else visualizer.ctx.fillStyle = visualizer.color;

    if(visualizer.bassBounce.debug === true && i <= visualizer.bassBounce._barEnd && i >= visualizer.bassBounce._barStart) visualizer.ctx.fillStyle = '#FFF';
}