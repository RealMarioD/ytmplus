import { globals, visualizer } from '../globals';
import { getBarColor, values } from './init';
import { averageOfArray } from '../utils';

const image = new Image();
let imgLoaded = false;

image.onload = () => {
    imgLoaded = true;
};


function handleImage(ctx, currentURL) {
    if(visualizer.image.type === 'Thumbnail') currentURL = document.getElementById('thumbnail').firstElementChild.src;
    else currentURL = visualizer.image.customURL;

    if(image.src !== currentURL) {
        imgLoaded = false;
        image.src = currentURL;
    }

    if(visualizer.image.removeThumbnail === true) {
        if(globals.player.style.opacity !== 0.001) globals.player.style.opacity = 0.001;
    }
    else if(globals.player.style.opacity !== 1) globals.player.style.opacity = 1;
    if(imgLoaded === true) drawVisImage(ctx);
}

function drawVisImage(ctx) {
    console.log('drew');
    ctx.save();
    ctx.beginPath();
    ctx.arc(values.WIDTH / 2, values.HEIGHT / 2, values.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, values.halfWidth - values.radius, values.halfHeight - values.radius, values.radius * 2, values.radius * 2);
    ctx.restore();
}


export function visualizerCircle(ctx) { // Bitwise truncation (~~number) is used here instead of Math.floor() to squish out more performance.
    if(visualizer.startsFrom === 'Left' || visualizer.startsFrom === 'Right') values.circleSize = 2; // 2(pi) = full
    else values.circleSize = 1; // 1(pi) = half;

    if(visualizer.bassBounce.enabled === true ||
        visualizer.rotate === 'Reactive (Bass)') calculateBass();

    getRotationValue();

    if(visualizer.image.type !== 'Disabled') handleImage(ctx);

    values.barTotal = values.circleSize * Math.PI / visualizer.bufferLength;
    values.barWidth = values.barTotal * 0.45;
    // No need for barSpace
    values.reactiveBarHeightMultiplier = 0.3 + values.bassSmoothRadius / 512; // 0.3 . . 0.55

    if(visualizer.startsFrom === 'Right') drawArcs(false, ctx);
    else if(visualizer.startsFrom === 'Left') drawArcs(true, ctx);
    else if(visualizer.startsFrom === 'Center' || visualizer.startsFrom === 'Edges') {
        drawArcs(false, ctx);
        drawArcs(true, ctx);
    }
}

function calculateBass() {
    values.bass = visualizer.dataArray.slice(
        ~~(visualizer.dataArray.length * visualizer.bassBounce.sensitivityStart),
        ~~(visualizer.dataArray.length * visualizer.bassBounce.sensitivityEnd) + 1
    );

    if(visualizer.bassBounce.smooth === true) values.bassSmoothRadius = ~~((values.bassSmoothRadius + (averageOfArray(values.bass) / 2)) / 2);
    else values.bassSmoothRadius = ~~(averageOfArray(values.bass) / 2);

    if(visualizer.bassBounce.enabled === true) values.radius = ~~(values.HEIGHT / 8) + values.bassSmoothRadius * values.heightModifier * 1.25;
}

function getRotationValue() {
    const r = visualizer.rotate,
        direction = (visualizer.rotateDirection === 'Clockwise') ? 1 : -1;

    if(r === 'Disabled') values.rotationValue = 0;
    else if(r === 'On') values.rotationValue += 0.005 * direction;
    else if(r === 'Reactive') values.rotationValue += (Math.pow(averageOfArray(visualizer.dataArray) / 10000 + 1, 2) - 1) * direction;
    else if(r === 'Reactive (Bass)') values.rotationValue += (Math.pow(values.bassSmoothRadius / 10000 + 1, 2) - 1) * direction;
}

function drawArcs(backwards, ctx) {
    ctx.save();
    ctx.translate(values.halfWidth, values.halfHeight); // move to center of circle
    ctx.rotate(values.startingPoint + values.rotationValue); // Set bar starting point to top + rotation

    for(let i = 0; i < visualizer.bufferLength; ++i) {
        if(i === 0 && backwards === true) ctx.rotate(-values.barTotal);
        else {
            getBarColor(i, ctx);

            if(visualizer.bassBounce.debug === true && i < values.bass.length && i >= ~~(visualizer.bufferLength * visualizer.bassBounce.sensitivityStart)) ctx.fillStyle = '#FFF';

            if(visualizer.bassBounce.enabled === true) values.barHeight = visualizer.dataArray[i] * values.heightModifier * values.reactiveBarHeightMultiplier;
            else values.barHeight = visualizer.dataArray[i] * values.heightModifier * 0.5;

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
    }
    ctx.restore();
}