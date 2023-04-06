import { visualizer } from '../globals';
import { getBarColor, values, ctx } from './init';
import { averageOfArray } from '../utils';
import { handleImage } from './image';

export function visualizerCircle() { // Bitwise truncation (~~number) is used here instead of Math.floor() to squish out more performance.
    if(visualizer.startsFrom === 'Left' || visualizer.startsFrom === 'Right') values.circleSize = 2; // 2(pi) = full
    else values.circleSize = 1; // 1(pi) = half;

    if(visualizer.bassBounce.enabled === true ||
        visualizer.rotate === 'Reactive (Bass)') calculateBass();

    getRotationValue();

    if(visualizer.image.type !== 'Disabled') handleImage();

    values.barTotal = values.circleSize * Math.PI / visualizer.bufferLength;
    values.barWidth = values.barTotal * 0.45;
    // No need for barSpace
    values.reactiveBarHeightMultiplier = 0.3 + values.bassSmoothRadius / 512; // 0.3 . . 0.55

    if(visualizer.startsFrom === 'Right') drawArcs(false);
    else if(visualizer.startsFrom === 'Left') drawArcs(true);
    else if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') {
        drawArcs(false);
        drawArcs(true);
    }
}

function calculateBass() {
    values.bass = visualizer.audioData.slice(
        ~~(visualizer.analyser.frequencyBinCount * visualizer.bassBounce.sensitivityStart),
        ~~(visualizer.analyser.frequencyBinCount * visualizer.bassBounce.sensitivityEnd) + 1
    );

    if(visualizer.bassBounce.smooth === true) values.bassSmoothRadius = ~~((values.bassSmoothRadius + (averageOfArray(values.bass) / 2)) / 2);
    else values.bassSmoothRadius = ~~(averageOfArray(values.bass) / 2);

    if(visualizer.bassBounce.enabled === true) values.radius = ~~(values.HEIGHT / 8) + values.bassSmoothRadius * values.heightModifier * 1.25;
}

function getRotationValue() {
    const direction = (visualizer.rotateDirection === 'Clockwise') ? 1 : -1;

    switch(visualizer.rotate) {
        case 'Disabled': default: { values.rotationValue = 0; } break;
        case 'On': { values.rotationValue += 0.005 * direction; } break;
        case 'Reactive': { values.rotationValue += (Math.pow(averageOfArray(visualizer.audioData) / 10000 + 1, 2) - 1) * direction; } break;
        case 'Reactive (Bass)': { values.rotationValue += (Math.pow(values.bassSmoothRadius / 10000 + 1, 2) - 1) * direction; } break;
    }
}

function drawArcs(backwards) {
    ctx.save();
    ctx.translate(values.halfWidth, values.halfHeight); // move to center of circle
    ctx.rotate(values.startingPoint + values.rotationValue); // Set bar starting point to top + rotation

    for(let i = 0; i < visualizer.bufferLength; ++i) {
        if(i === 0 && backwards === true) {
            ctx.rotate(-values.barTotal);
            continue;
        }

        getBarColor(i);

        if(visualizer.bassBounce.enabled === true) values.barHeight = visualizer.audioData[i] * values.heightModifier * values.reactiveBarHeightMultiplier;
        else values.barHeight = visualizer.audioData[i] * values.heightModifier * 0.5;

        if(visualizer.move === 'Outside' || visualizer.move === 'Both Sides') values.outerRadius = values.radius + values.barHeight;
        else values.outerRadius = values.radius;

        if(visualizer.move === 'Inside' || visualizer.move === 'Both Sides') values.innerRadius = values.radius - values.barHeight;
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
    ctx.restore();
}