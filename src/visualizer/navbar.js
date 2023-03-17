import { globals } from '../globals';
import { values } from './init';

export function visualizerNavbar(ctx) {
    if(globals.visualizer.startsFrom === 'Center') values.xPosOffset = values.barWidth / 2; // Centers 1 bar
    else if(globals.visualizer.startsFrom === 'Edges') values.xPosOffset = values.barSpace / 2; // Both sides are offset a bit for perfect centering
    else values.xPosOffset = 0;

    const maxBarHeight = (values.HEIGHT / 255), colorDivergence = (globals.visualizer.bufferLength / globals.visualizer.rgbData.length);
    for(let i = 0; i < globals.visualizer.bufferLength; i++) {
        values.barHeight = globals.visualizer.dataArray[i] * maxBarHeight;

        if(globals.visualizer.rgb.enabled === true) {
            const color = ~~(i / colorDivergence);
            if(globals.visualizer.fade === true) ctx.fillStyle = `rgba(${globals.visualizer.rgbData[color].red}, ${globals.visualizer.rgbData[color].green}, ${globals.visualizer.rgbData[color].blue}, ${globals.visualizer.dataArray[i] < 128 ? globals.visualizer.dataArray[i] * 2 / 255 : 1.0})`;
            else ctx.fillStyle = `rgb(${globals.visualizer.rgbData[color].red}, ${globals.visualizer.rgbData[color].green}, ${globals.visualizer.rgbData[color].blue})`;
        }
        else ctx.fillStyle = globals.visualizer.color;

        // To this day I don't get the Y and values.HEIGHT values
        if(globals.visualizer.startsFrom === 'Left') {
            ctx.fillRect(values.xPosOffset, values.HEIGHT - values.barHeight, values.barWidth, values.barHeight); // Draws rect from left to right
            values.xPosOffset += values.barTotal;
        }
        else if(globals.visualizer.startsFrom === 'Center') {
            if(values.halfWidth - values.xPosOffset < 0 - values.barWidth) break;
            ctx.fillRect(values.halfWidth - values.xPosOffset, values.HEIGHT - values.barHeight, values.barWidth, values.barHeight); // Draws rect from left to right, starting from center to left
            values.xPosOffset += values.barTotal;
        }
        else if(globals.visualizer.startsFrom === 'Right') {
            ctx.fillRect(values.WIDTH - values.xPosOffset, values.HEIGHT - values.barHeight, 0 - values.barWidth, values.barHeight); // Draws rect from right to left
            values.xPosOffset += values.barTotal;
        }
        else if(globals.visualizer.startsFrom === 'Edges') {
            if(values.xPosOffset > values.halfWidth) break;
            ctx.fillRect(values.xPosOffset, values.HEIGHT - values.barHeight, values.barWidth, values.barHeight); // Draws rect from left to right, from left to center
            values.xPosOffset += values.barTotal;
        }
    }

    if(globals.visualizer.startsFrom === 'Center') values.xPosOffset = values.halfWidth + values.barWidth / 2 + values.barSpace; // Reset pos to center + skip first bar
    else if(globals.visualizer.startsFrom === 'Edges') values.xPosOffset = values.barWidth + (values.barSpace / 2); // Reset pos to right + offset for perfect center
    else return;

    for(let i = 1; i < globals.visualizer.bufferLength; i++) {
        values.barHeight = globals.visualizer.dataArray[i] * maxBarHeight;
        if(globals.visualizer.rgb.enabled === true) {
            const color = ~~(i / colorDivergence);
            if(globals.visualizer.fade === true) ctx.fillStyle = `rgba(${globals.visualizer.rgbData[color].red}, ${globals.visualizer.rgbData[color].green}, ${globals.visualizer.rgbData[color].blue}, ${globals.visualizer.dataArray[i] < 128 ? globals.visualizer.dataArray[i] * 2 / 255 : 1.0})`;
            else ctx.fillStyle = `rgb(${globals.visualizer.rgbData[color].red}, ${globals.visualizer.rgbData[color].green}, ${globals.visualizer.rgbData[color].blue})`;
        }
        else ctx.fillStyle = globals.visualizer.color;
        if(globals.visualizer.startsFrom === 'Center') {
            if(values.xPosOffset > values.WIDTH) break;
            ctx.fillRect(values.xPosOffset, values.HEIGHT - values.barHeight, values.barWidth, values.barHeight); // Draws rect from left to right, from center to right
            values.xPosOffset += values.barTotal;
        }
        else if(globals.visualizer.startsFrom === 'Edges') {
            if(values.xPosOffset > values.halfWidth) break;
            ctx.fillRect(values.WIDTH - values.xPosOffset, values.HEIGHT - values.barHeight, values.barWidth, values.barHeight); // Draws rect from left to right, from right to center
            values.xPosOffset += values.barTotal;
        }
    }
}