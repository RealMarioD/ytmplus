import { visualizer } from '../../globals/visualizer';
import { getBarColor } from './utils';

export function visualizerNavbar() {
    let xPosOffset;
    if(visualizer.startsFrom === 'Center') xPosOffset = visualizer.values.barWidth + visualizer.values.barSpace / 2; // Centers 1 bar
    else if(visualizer.startsFrom === 'Edges') xPosOffset = visualizer.values.barSpace / 2; // Both sides are offset a bit for perfect centering
    else xPosOffset = 0;

    const maxBarHeight = visualizer.values.HEIGHT;

    firstDraw(maxBarHeight, xPosOffset);

    if(visualizer.startsFrom === 'Center') {
        xPosOffset = visualizer.values.halfWidth + visualizer.values.barSpace / 2; // Reset pos to center
        secondDraw(maxBarHeight, xPosOffset);
    }
    else if(visualizer.startsFrom === 'Edges') {
        xPosOffset = visualizer.values.barWidth + (visualizer.values.barSpace / 2); // Reset pos to right + offset for perfect center
        secondDraw(maxBarHeight, xPosOffset);
    }
}

function firstDraw(maxBarHeight, xPosOffset) {
    for(let i = visualizer.removedBeginning; i < visualizer.removedEnding; i++) {
        const barHeight = visualizer.normalizedAudioData[i] * maxBarHeight;

        getBarColor(i);

        // To this day I don't get the Y and height values
        if(visualizer.startsFrom === 'Left') {
            visualizer.ctx.fillRect( // Draws rect from left to right
                xPosOffset,
                visualizer.values.HEIGHT - barHeight,
                visualizer.values.barWidth,
                barHeight
            );
        }
        else if(visualizer.startsFrom === 'Center') {
            if(visualizer.values.halfWidth - xPosOffset < 0 - visualizer.values.barWidth) break;
            visualizer.ctx.fillRect( // Draws rect from left to right, starting from center to left
                visualizer.values.halfWidth - xPosOffset,
                visualizer.values.HEIGHT - barHeight,
                visualizer.values.barWidth,
                barHeight
            );
        }
        else if(visualizer.startsFrom === 'Right') {
            visualizer.ctx.fillRect( // Draws rect from right to left
                visualizer.values.WIDTH - xPosOffset,
                visualizer.values.HEIGHT - barHeight,
                0 - visualizer.values.barWidth,
                barHeight
            );
        }
        else if(visualizer.startsFrom === 'Edges') {
            if(xPosOffset > visualizer.values.halfWidth) break;
            visualizer.ctx.fillRect( // Draws rect from left to right, from left to center
                xPosOffset,
                visualizer.values.HEIGHT - barHeight,
                visualizer.values.barWidth,
                barHeight
            );
        }
        xPosOffset += visualizer.values.barTotal;
    }
}

function secondDraw(maxBarHeight, xPosOffset) {
    for(let i = visualizer.removedBeginning; i < visualizer.removedEnding; i++) {
        const barHeight = visualizer.normalizedAudioData[i] * maxBarHeight;

        getBarColor(i);

        if(visualizer.startsFrom === 'Center') {
            if(xPosOffset > visualizer.values.WIDTH) break;
            visualizer.ctx.fillRect( // Draws rect from left to right, from center to right
                xPosOffset,
                visualizer.values.HEIGHT - barHeight,
                visualizer.values.barWidth,
                barHeight
            );
        }
        else if(visualizer.startsFrom === 'Edges') {
            if(xPosOffset > visualizer.values.halfWidth) break;
            visualizer.ctx.fillRect( // Draws rect from left to right, from right to center
                visualizer.values.WIDTH - xPosOffset,
                visualizer.values.HEIGHT - barHeight,
                visualizer.values.barWidth,
                barHeight
            );
        }
        xPosOffset += visualizer.values.barTotal;
    }
}