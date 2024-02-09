import { visualizer } from '../../globals/visualizer';
import { drawVisImage, imgLoaded } from './image';
import { calculateBass, getRotationValue, getBarColor } from './utils';

export function visualizerCircle() { // Bitwise truncation (~~number) is used here instead of Math.floor() to squish out more performance.
    if(visualizer.shake.enabled === true && visualizer.values.bassSmoothRadius > visualizer.shake.threshold / 100) preShake();
    if(visualizer.startsFrom === 'Left' || visualizer.startsFrom === 'Right') visualizer.values.circleSize = 2; // 2(pi) = full
    else visualizer.values.circleSize = 1; // 1(pi) = half;

    if(visualizer.bassBounce.enabled === true || visualizer.shake.enabled === true || visualizer.rotate === 'Reactive (Bass)') calculateBass();

    getRotationValue();

    if(visualizer.image.type !== 'Disabled' && imgLoaded === true) drawVisImage();

    const maxBarHeight = (visualizer.values.HEIGHT / 2) - (visualizer.values.maxRadius);

    if(visualizer.startsFrom === 'Right') drawArcs(false, maxBarHeight);
    else if(visualizer.startsFrom === 'Left') drawArcs(true, maxBarHeight);
    else if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') {
        drawArcs(false, maxBarHeight);
        drawArcs(true, maxBarHeight);
    }
    if(visualizer.shake.enabled === true && visualizer.values.bassSmoothRadius > visualizer.shake.threshold / 100) postShake();
}

function drawArcs(backwards, maxBarHeight) {
    visualizer.ctx.save();
    visualizer.ctx.translate(visualizer.values.halfWidth, visualizer.values.halfHeight); // move to center of circle
    visualizer.ctx.rotate(visualizer.values.startingPoint + (visualizer.values.barTotal / 2 + visualizer.values.rotationValue)); // Set bar starting point to top + rotation

    for(let i = visualizer.removedBeginning; i < visualizer.removedEnding; i++) {
        getBarColor(i);
        const barHeight = visualizer.normalizedAudioData[i] * maxBarHeight;

        if(visualizer.move === 'Outside' || visualizer.move === 'Both Sides') visualizer.values.outerRadius = visualizer.values.radius + barHeight;
        else visualizer.values.outerRadius = visualizer.values.radius;

        if(visualizer.move === 'Inside' || visualizer.move === 'Both Sides') visualizer.values.innerRadius = visualizer.values.radius - barHeight;
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

function preShake() {
    visualizer.ctx.save();
    const floatingThreshold = visualizer.shake.threshold / 100;
    const whatever = 1 - floatingThreshold;
    const dx = (visualizer.values.bassSmoothRadius - floatingThreshold) / whatever * visualizer.shake.multiplier * (~~(Math.random() * 2) === 0 ? 1 : -1);
    const dy = (visualizer.values.bassSmoothRadius - floatingThreshold) / whatever * visualizer.shake.multiplier * (~~(Math.random() * 2) === 0 ? 1 : -1);
    console.log(`dx: ${dx}, dy: ${dy}`);
    visualizer.ctx.translate(dx, dy);
}

function postShake() {
    visualizer.ctx.restore();
}