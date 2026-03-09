import { visualizer } from '../../globals/visualizer';

/**
 * Returns a specialized color renderer function based on current visualizer settings.
 * This eliminates branching in the hot rendering loop for better performance.
 * @returns {Function|null} Specialized color function, or null if static color (set once before loop)
 */
export function getColorRenderer() {
    const mode = visualizer.colorMode;
    const fadeEnabled = visualizer.fade;
    const debugEnabled = visualizer.bassBounce.debug;

    // Determine the base renderer first
    let baseRenderer;
    switch(mode) {
        case 'rainbow':
            baseRenderer = fadeEnabled === true ? getBarColorRainbowFade : getBarColorRainbow;
            break;
        case 'rgb':
            baseRenderer = fadeEnabled === true ? getBarColorRgbFade : getBarColorRgb;
            break;
        case 'static':
        default:
            baseRenderer = fadeEnabled === true ? getBarColorFade : staticColorRenderer; // No need to set color every bar if static, will be set once before loop
            visualizer.ctx.fillStyle = `rgb(${visualizer.color[0]}, ${visualizer.color[1]}, ${visualizer.color[2]})`;
            break;
    }
    // Wrap with debug check if needed (reuses specialized renderers, no branching)
    if(debugEnabled) {
        const barStart = visualizer.bassBounce._barStart;
        const barEnd = visualizer.bassBounce._barEnd;
        const ctx = visualizer.ctx;
        return (i) => {
            if(i >= barStart && i <= barEnd)
                ctx.fillStyle = '#FFF';
            else if(baseRenderer !== null)
                baseRenderer(i);

            // If baseRenderer is null, static color was already set before loop
        };
    }

    return baseRenderer;
}

// dont do nothing, just a placeholder to avoid if checks in render loops when static color is used
function staticColorRenderer() { return; }

function getBarColorRgb(i) {
    if(i !== 0) return;
    const color = visualizer.rgb._data[i];
    visualizer.ctx.fillStyle = `rgb(${color.red}, ${color.green}, ${color.blue})`;
}

function getBarColorRgbFade(i) {
    const color = visualizer.rgb._data[0];
    const alpha = visualizer.toRenderAudioData[i];
    visualizer.ctx.fillStyle = `rgba(${color.red}, ${color.green}, ${color.blue}, ${alpha})`;
}

function getBarColorRainbowFade(i) {
    const colors = visualizer.rgb._data[~~(i / visualizer.colorDivergence)];
    const alpha = visualizer.toRenderAudioData[i];
    visualizer.ctx.fillStyle = `rgba(${colors.red}, ${colors.green}, ${colors.blue}, ${alpha})`;
}

function getBarColorRainbow(i) {
    const colors = visualizer.rgb._data[~~(i / visualizer.colorDivergence)];
    visualizer.ctx.fillStyle = `rgb(${colors.red}, ${colors.green}, ${colors.blue})`;
}

function getBarColorFade(i) {
    const alpha = visualizer.toRenderAudioData[i];
    visualizer.ctx.fillStyle = `rgba(${visualizer.color[0]}, ${visualizer.color[1]}, ${visualizer.color[2]}, ${alpha})`;
}