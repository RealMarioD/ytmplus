import { visualizer } from '../../globals/visualizer';
import { drawVisImage, imgLoaded } from './image';
import { averageOfArray, getBarColor } from './utils';

export function visualizerCircle() { // Bitwise truncation (~~number) is used here instead of Math.floor() to squish out more performance.
    if(visualizer.startsFrom === 'Left' || visualizer.startsFrom === 'Right') visualizer.visualizer.values.circleSize = 2; // 2(pi) = full
    else visualizer.values.circleSize = 1; // 1(pi) = half;

    if(visualizer.bassBounce.enabled === true || visualizer.rotate === 'Reactive (Bass)') calculateBass();

    getRotationValue();

    if(visualizer.image.type !== 'Disabled' && imgLoaded === true) drawVisImage();

    visualizer.values.reactiveBarHeightMultiplier = 0.3 + visualizer.values.bassSmoothRadius / 512; // 0.3 . . 0.55

    if(visualizer.startsFrom === 'Right') drawArcs(false);
    else if(visualizer.startsFrom === 'Left') drawArcs(true);
    else if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') {
        drawArcs(false);
        drawArcs(true);
    }
}

function calculateBass() {
    visualizer.values.bass = visualizer.audioData.slice(
        visualizer.bassBounce._barStart,
        visualizer.bassBounce._barEnd
    );

    if(visualizer.bassBounce.smooth === true) visualizer.values.bassSmoothRadius = ~~((visualizer.values.bassSmoothRadius + (averageOfArray(visualizer.values.bass) / 2)) / 2);
    else visualizer.values.bassSmoothRadius = ~~(averageOfArray(visualizer.values.bass) / 2);

    if(visualizer.bassBounce.enabled === true) visualizer.values.radius = ~~(visualizer.values.HEIGHT / 8) + visualizer.values.bassSmoothRadius * visualizer.values.heightModifier * 1.25;
}

function getRotationValue() {
    const direction = (visualizer.rotateDirection === 'Clockwise') ? 1 : -1;

    switch(visualizer.rotate) {
        case 'Disabled': default: { visualizer.values.rotationValue = 0; } break;
        case 'On': { visualizer.values.rotationValue += 0.005 * direction; } break;
        case 'Reactive': { visualizer.values.rotationValue += (Math.pow(averageOfArray(visualizer.audioData) / 10000 + 1, 2) - 1) * direction; } break;
        case 'Reactive (Bass)': { visualizer.values.rotationValue += (Math.pow(visualizer.values.bassSmoothRadius / 10000 + 1, 2) - 1) * direction; } break;
    }
}

function drawArcs(backwards) {
    visualizer.ctx.save();
    visualizer.ctx.translate(visualizer.values.halfWidth, visualizer.values.halfHeight); // move to center of circle
    visualizer.ctx.rotate(visualizer.values.startingPoint + (visualizer.values.barTotal / 2 + visualizer.values.rotationValue)); // Set bar starting point to top + rotation

    for(let i = visualizer.removedBeginning; i < visualizer.bufferLength; ++i) {
        // if(visualizer.values.circleSize === 1 && backwards === true && (i === 0 || i === visualizer.bufferLength - 1)) {
        //     visualizer.ctx.rotate(-visualizer.values.barTotal);
        //     continue;
        // }

        getBarColor(i);

        if(visualizer.bassBounce.enabled === true) visualizer.values.barHeight = visualizer.audioData[i] * visualizer.values.heightModifier * visualizer.values.reactiveBarHeightMultiplier;
        else visualizer.values.barHeight = visualizer.audioData[i] * visualizer.values.heightModifier * 0.5;

        if(visualizer.move === 'Outside' || visualizer.move === 'Both Sides') visualizer.values.outerRadius = visualizer.values.radius + visualizer.values.barHeight;
        else visualizer.values.outerRadius = visualizer.values.radius;

        if(visualizer.move === 'Inside' || visualizer.move === 'Both Sides') visualizer.values.innerRadius = visualizer.values.radius - visualizer.values.barHeight;
        else visualizer.values.innerRadius = visualizer.values.radius;

        if(visualizer.values.outerRadius < 0) visualizer.values.outerRadius = 0;
        if(visualizer.values.innerRadius < 0) visualizer.values.innerRadius = 0;

        visualizer.ctx.beginPath();
        visualizer.ctx.arc(0, 0, visualizer.values.innerRadius, -visualizer.values.barWidth, visualizer.values.barWidth);
        visualizer.ctx.arc(0, 0, visualizer.values.outerRadius, visualizer.values.barWidth, -visualizer.values.barWidth, true);
        visualizer.ctx.fill();
        if(backwards === true) visualizer.ctx.rotate(-visualizer.values.barTotal); // rotate the coordinates by one bar
        else visualizer.ctx.rotate(visualizer.values.barTotal);
    }
    visualizer.ctx.restore();
}