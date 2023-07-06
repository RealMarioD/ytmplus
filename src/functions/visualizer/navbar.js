import { visualizer } from '../../globals/visualizer';
import { getBarColor } from './utils';

export function visualizerNavbar() {
    if(visualizer.startsFrom === 'Center') visualizer.values.xPosOffset = visualizer.values.barWidth + visualizer.values.barSpace / 2; // Centers 1 bar
    else if(visualizer.startsFrom === 'Edges') visualizer.values.xPosOffset = visualizer.values.barSpace / 2; // Both sides are offset a bit for perfect centering
    else visualizer.values.xPosOffset = 0;

    const maxBarHeight = (visualizer.values.HEIGHT / 255);

    firstDraw(maxBarHeight);

    if(visualizer.startsFrom === 'Center') {
        visualizer.values.xPosOffset = visualizer.values.halfWidth + visualizer.values.barSpace / 2; // Reset pos to center
        secondDraw(maxBarHeight);
    }
    else if(visualizer.startsFrom === 'Edges') {
        visualizer.values.xPosOffset = visualizer.values.barWidth + (visualizer.values.barSpace / 2); // Reset pos to right + offset for perfect center
        secondDraw(maxBarHeight);
    }
}

function firstDraw(maxBarHeight) {
    for(let i = visualizer.removedBeginning; i < visualizer.bufferLength; i++) {
        visualizer.values.barHeight = visualizer.audioData[i] * maxBarHeight;

        getBarColor(i);

        // To this day I don't get the Y and height values
        if(visualizer.startsFrom === 'Left') {
            visualizer.ctx.fillRect( // Draws rect from left to right
                visualizer.values.xPosOffset,
                visualizer.values.HEIGHT - visualizer.values.barHeight,
                visualizer.values.barWidth,
                visualizer.values.barHeight
            );
        }
        else if(visualizer.startsFrom === 'Center') {
            if(visualizer.values.halfWidth - visualizer.values.xPosOffset < 0 - visualizer.values.barWidth) break;
            visualizer.ctx.fillRect( // Draws rect from left to right, starting from center to left
                visualizer.values.halfWidth - visualizer.values.xPosOffset,
                visualizer.values.HEIGHT - visualizer.values.barHeight,
                visualizer.values.barWidth,
                visualizer.values.barHeight
            );
        }
        else if(visualizer.startsFrom === 'Right') {
            visualizer.ctx.fillRect( // Draws rect from right to left
                visualizer.values.WIDTH - visualizer.values.xPosOffset,
                visualizer.values.HEIGHT - visualizer.values.barHeight,
                0 - visualizer.values.barWidth,
                visualizer.values.barHeight
            );
        }
        else if(visualizer.startsFrom === 'Edges') {
            if(visualizer.values.xPosOffset > visualizer.values.halfWidth) break;
            visualizer.ctx.fillRect( // Draws rect from left to right, from left to center
                visualizer.values.xPosOffset,
                visualizer.values.HEIGHT - visualizer.values.barHeight,
                visualizer.values.barWidth,
                visualizer.values.barHeight
            );
        }
        visualizer.values.xPosOffset += visualizer.values.barTotal;
    }
}

function secondDraw(maxBarHeight) {
    for(let i = visualizer.removedBeginning; i < visualizer.bufferLength; i++) {
        visualizer.values.barHeight = visualizer.audioData[i] * maxBarHeight;

        getBarColor(i);

        if(visualizer.startsFrom === 'Center') {
            if(visualizer.values.xPosOffset > visualizer.values.WIDTH) break;
            visualizer.ctx.fillRect( // Draws rect from left to right, from center to right
                visualizer.values.xPosOffset,
                visualizer.values.HEIGHT - visualizer.values.barHeight,
                visualizer.values.barWidth,
                visualizer.values.barHeight
            );
        }
        else if(visualizer.startsFrom === 'Edges') {
            if(visualizer.values.xPosOffset > visualizer.values.halfWidth) break;
            visualizer.ctx.fillRect( // Draws rect from left to right, from right to center
                visualizer.values.WIDTH - visualizer.values.xPosOffset,
                visualizer.values.HEIGHT - visualizer.values.barHeight,
                visualizer.values.barWidth,
                visualizer.values.barHeight
            );
        }
        visualizer.values.xPosOffset += visualizer.values.barTotal;
    }
}