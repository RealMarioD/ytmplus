import { visualizer } from '../../globals/visualizer';
import { drawVisImage, imgLoaded } from './image';
import { calculateBass, getRotationValue } from './utils';
import { getColorRenderer } from './colors';

export function visualizerCircle(toRenderAudioData) {
    // Cache frequently accessed properties
    const startsFrom = visualizer.startsFrom;
    const shakeEnabled = visualizer.shake.enabled;
    const bassBounceEnabled = visualizer.bassBounce.enabled;

    const doWeShake = shakeEnabled === true && visualizer.values.bassSmoothRadius > visualizer.shake.threshold;
    if(doWeShake === true) preShake();

    if(startsFrom === 'Left' || startsFrom === 'Right') visualizer.values.circleSize = 2; // 2(pi) = full
    else visualizer.values.circleSize = 1; // 1(pi) = half;

    if(bassBounceEnabled === true || shakeEnabled === true || visualizer.rotate === 'Reactive (Bass)') calculateBass();

    getRotationValue();

    if(visualizer.image.type !== 'Disabled' && imgLoaded === true) drawVisImage();

    const maxBarHeight = (visualizer.values.halfHeight) - (visualizer.values.maxRadius);

    if(startsFrom === 'Right') drawArcs(toRenderAudioData, false, maxBarHeight);
    else if(startsFrom === 'Left') drawArcs(toRenderAudioData, true, maxBarHeight);
    else if(startsFrom === 'Center') {
        drawArcs(toRenderAudioData, false, maxBarHeight);
        drawArcs(toRenderAudioData, true, maxBarHeight);
    }
    else if(startsFrom === 'Edges') {
        drawArcs(toRenderAudioData, false, maxBarHeight);
        drawArcs(toRenderAudioData, false, maxBarHeight, 3);
    }

    if(doWeShake === true) postShake();
}

function drawArcs(toRenderAudioData, backwards, maxBarHeight, startPoint = 1) {
    // Cache frequently accessed properties (critical for performance in hot loop)
    const ctx = visualizer.ctx;
    const move = visualizer.move;
    const radius = visualizer.values.radius;
    const barWidth = visualizer.values.barWidth;
    const barTotal = visualizer.values.barTotal;

    // Pre-compute movement mode (eliminates string comparisons in loop)
    const moveOutside = move === 'Outside' || move === 'Both Sides';
    const moveInside = move === 'Inside' || move === 'Both Sides';

    // Get specialized color renderer (eliminates branching in loop)
    const colorRenderer = getColorRenderer();

    ctx.save();
    ctx.translate(visualizer.values.halfWidth, visualizer.values.halfHeight); // move to center of circle
    ctx.rotate(visualizer.values.startingPoint * startPoint + (visualizer.values.barTotalHalf + visualizer.values.rotationValue)); // Set bar starting point to top + rotation

    for(let i = 0; i < toRenderAudioData.length; i++) {
        colorRenderer(i);
        const barHeight = toRenderAudioData[i] * maxBarHeight;

        // Use pre-computed booleans instead of string comparisons
        let outerRadius = moveOutside ? radius + barHeight : radius;
        let innerRadius = moveInside ? radius - barHeight : radius;

        // Simple if-based clamping (faster than Math.max in hot loop)
        if(outerRadius < 0) outerRadius = 0;
        if(innerRadius < 0) innerRadius = 0;

        ctx.beginPath();
        ctx.arc(0, 0, innerRadius, -barWidth, barWidth);
        ctx.arc(0, 0, outerRadius, barWidth, -barWidth, true);
        ctx.fill();
        if(backwards === true) ctx.rotate(-barTotal); // rotate the coordinates by one bar
        else ctx.rotate(barTotal);
    }
    ctx.restore();
}

function preShake() {
    // Bitwise truncation (~~number) is used here instead of Math.floor() to squish out more performance
    visualizer.ctx.save();
    const movement = visualizer.values.halfHeight * 0.01 * visualizer.shake.multiplier;
    let dx = movement, dy = movement;
    if(~~(Math.random() * 2) === 0) dx = -movement;
    if(~~(Math.random() * 2) === 0) dy = -movement;

    visualizer.ctx.translate(dx, dy);
}

function postShake() {
    visualizer.ctx.restore();
}