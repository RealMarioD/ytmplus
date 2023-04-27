import { visualizer } from '../globals';
import { getBarColor, values, ctx } from './init';

export function visualizerNavbar() {
    if(visualizer.startsFrom === 'Center') values.xPosOffset = values.barWidth + values.barSpace / 2; // Centers 1 bar
    else if(visualizer.startsFrom === 'Edges') values.xPosOffset = values.barSpace / 2; // Both sides are offset a bit for perfect centering
    else values.xPosOffset = 0;

    const maxBarHeight = (values.HEIGHT / 255);

    firstDraw(maxBarHeight);

    if(visualizer.startsFrom === 'Center') {
        values.xPosOffset = values.halfWidth + values.barSpace / 2; // Reset pos to center + skip first bar
        secondDraw(maxBarHeight, 0);
    }
    else if(visualizer.startsFrom === 'Edges') {
        values.xPosOffset = values.barWidth + (values.barSpace / 2); // Reset pos to right + offset for perfect center
        secondDraw(maxBarHeight, 0);
    }
}

function firstDraw(maxBarHeight) {
    for(let i = 0; i < visualizer.bufferLength; i++) {
        values.barHeight = visualizer.audioData[i] * maxBarHeight;

        getBarColor(i);

        // To this day I don't get the Y and values.HEIGHT values
        if(visualizer.startsFrom === 'Left') {
            ctx.fillRect( // Draws rect from left to right
                values.xPosOffset,
                values.HEIGHT - values.barHeight,
                values.barWidth,
                values.barHeight
            );
        }
        else if(visualizer.startsFrom === 'Center') {
            if(values.halfWidth - values.xPosOffset < 0 - values.barWidth) break;
            ctx.fillRect( // Draws rect from left to right, starting from center to left
                values.halfWidth - values.xPosOffset,
                values.HEIGHT - values.barHeight,
                values.barWidth,
                values.barHeight
            );
        }
        else if(visualizer.startsFrom === 'Right') {
            ctx.fillRect( // Draws rect from right to left
                values.WIDTH - values.xPosOffset,
                values.HEIGHT - values.barHeight,
                0 - values.barWidth,
                values.barHeight
            );
        }
        else if(visualizer.startsFrom === 'Edges') {
            if(values.xPosOffset > values.halfWidth) break;
            ctx.fillRect( // Draws rect from left to right, from left to center
                values.xPosOffset,
                values.HEIGHT - values.barHeight,
                values.barWidth,
                values.barHeight
            );
        }
        values.xPosOffset += values.barTotal;
    }
}

function secondDraw(maxBarHeight, i) {
    for(i; i < visualizer.bufferLength; i++) {
        values.barHeight = visualizer.audioData[i] * maxBarHeight;

        getBarColor(i);

        if(visualizer.startsFrom === 'Center') {
            if(values.xPosOffset > values.WIDTH) break;
            ctx.fillRect( // Draws rect from left to right, from center to right
                values.xPosOffset,
                values.HEIGHT - values.barHeight,
                values.barWidth,
                values.barHeight
            );
        }
        else if(visualizer.startsFrom === 'Edges') {
            if(values.xPosOffset > values.halfWidth) break;
            ctx.fillRect( // Draws rect from left to right, from right to center
                values.WIDTH - values.xPosOffset,
                values.HEIGHT - values.barHeight,
                values.barWidth,
                values.barHeight
            );
        }
        values.xPosOffset += values.barTotal;
    }
}