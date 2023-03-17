import { globals } from '../globals';
import { values } from './init';
import { averageOfArray } from '../utils';

export function visualizerCircle(ctx) { // Bitwise truncation (~~number) is used here instead of Math.floor() to squish out more performance.
    if(globals.visualizer.startsFrom === 'Left' || globals.visualizer.startsFrom === 'Right') values.circleSize = 2; // 2(pi) = full
    else values.circleSize = 1; // 1(pi) = half;

    if(globals.visualizer.bassBounce.enabled === true || globals.visualizer.rotate === 'Reactive (Bass)') {
        values.bass = globals.visualizer.dataArray.slice(
            ~~(globals.visualizer.dataArray.length * globals.visualizer.bassBounce.sensitivityStart),
            ~~(globals.visualizer.dataArray.length * globals.visualizer.bassBounce.sensitivityEnd) + 1
        );

        if(globals.visualizer.bassBounce.smooth === true) values.bassSmoothRadius = ~~((values.bassSmoothRadius + (averageOfArray(values.bass) / 2)) / 2);
        else values.bassSmoothRadius = ~~(averageOfArray(values.bass) / 2);

        if(globals.visualizer.bassBounce.enabled === true) values.radius = ~~(values.HEIGHT / 8) + values.bassSmoothRadius * values.heightModifier * 1.25;
    }

    switch(globals.visualizer.rotate) {
        case 'On':
            if(globals.visualizer.rotateDirection === 'Clockwise') values.rotationValue += 0.005;
            else values.rotationValue -= 0.005;
            break;
        case 'Reactive':
            if(globals.visualizer.rotateDirection === 'Clockwise') values.rotationValue += Math.pow(averageOfArray(globals.visualizer.dataArray) / 10000 + 1, 2) - 1;
            else values.rotationValue -= Math.pow(averageOfArray(globals.visualizer.dataArray) / 10000 + 1, 2) - 1;
            break;
        case 'Reactive (Bass)':
            if(globals.visualizer.rotateDirection === 'Clockwise') values.rotationValue += Math.pow(values.bassSmoothRadius / 10000 + 1, 2) - 1;
            else values.rotationValue -= Math.pow(values.bassSmoothRadius / 10000 + 1, 2) - 1;
            break;
        default: values.rotationValue = 0; break;
    }


    values.barTotal = values.circleSize * Math.PI / globals.visualizer.bufferLength;
    values.barWidth = values.barTotal * 0.45;
    // No need for barSpace
    values.reactiveBarHeightMultiplier = 0.3 + values.bassSmoothRadius / 512; // 0.3 . . 0.55

    function drawArcs(backwards) {
        ctx.save();
        ctx.translate(values.halfWidth, values.halfHeight); // move to center of circle
        ctx.rotate(values.startingPoint + values.rotationValue); // Set bar starting point to top + rotation

        const colorDivergence = (globals.visualizer.bufferLength / globals.visualizer.rgb.samples);
        for(let i = 0; i < globals.visualizer.bufferLength; ++i) {
            if(i === 0 && backwards === true) ctx.rotate(-values.barTotal);
            else {
                if(globals.visualizer.rgb.enabled === true) {
                    const color = ~~(i / colorDivergence);
                    if(globals.visualizer.fade === true) ctx.fillStyle = `rgba(${globals.visualizer.rgbData[color].red}, ${globals.visualizer.rgbData[color].green}, ${globals.visualizer.rgbData[color].blue}, ${globals.visualizer.dataArray[i] < 128 ? globals.visualizer.dataArray[i] * 2 / 255 : 1.0})`;
                    else ctx.fillStyle = `rgb(${globals.visualizer.rgbData[color].red}, ${globals.visualizer.rgbData[color].green}, ${globals.visualizer.rgbData[color].blue})`;
                }
                else ctx.fillStyle = globals.visualizer.color;

                if(globals.visualizer.bassBounce.debug === true && i < values.bass.length && i >= ~~(globals.visualizer.bufferLength * globals.visualizer.bassBounce.sensitivityStart)) ctx.fillStyle = '#FFF';

                if(globals.visualizer.bassBounce.enabled === true) values.barHeight = globals.visualizer.dataArray[i] * values.heightModifier * values.reactiveBarHeightMultiplier;
                else values.barHeight = globals.visualizer.dataArray[i] * values.heightModifier * 0.5;

                if(globals.visualizer.move == 'Outside' || globals.visualizer.move == 'Both Sides') values.outerRadius = values.radius + values.barHeight;
                else values.outerRadius = values.radius;

                if(globals.visualizer.move == 'Inside' || globals.visualizer.move == 'Both Sides') values.innerRadius = values.radius - values.barHeight;
                else values.innerRadius = values.radius;

                if(values.outerRadius < 0) values.outerRadius = 0;
                if(values.innerRadius < 0) values.innerRadius = 0;

                ctx.beginPath();
                ctx.arc(0, 0, values.innerRadius, -values.barWidth, values.barWidth);
                ctx.arc(0, 0, values.outerRadius, values.barWidth, -values.barWidth, true);
                ctx.fill();
                if(backwards === true) ctx.rotate(-values.barTotal); // rotate the coordinates by one bar
                else ctx.rotate(values.barTotal);
            }
        }
        ctx.restore();
    }

    if(globals.visualizer.startsFrom === 'Right' ||
        globals.visualizer.startsFrom === 'Center' ||
        globals.visualizer.startsFrom === 'Edges') drawArcs();

    if(globals.visualizer.startsFrom === 'Left' ||
        globals.visualizer.startsFrom === 'Center' ||
        globals.visualizer.startsFrom === 'Edges') drawArcs(true);
}