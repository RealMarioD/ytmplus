import { globals } from '../globals';
import { visualizerCircle } from './circle';
import { visualizerNavbar } from './navbar';

export let video;
export function getVideo() {
    video = document.querySelector('video');
    if(video) startVisualizer();
    else {
        console.warn('ytmPlus: Query "video" not found, retrying in 100ms.');
        setTimeout(() => { getVideo(); }, 100);
    }
}

export const values = {
    WIDTH: undefined,
    HEIGHT: 1,
    halfWidth: undefined,
    halfHeight: undefined,
    xPosOffset: undefined,
    barTotal: undefined,
    barWidth: undefined,
    barSpace: undefined,
    barHeight: undefined,
    circleSize: undefined,
    radius: 1,
    heightModifier: 1,
    innerRadius: undefined,
    outerRadius: undefined,
    rotationValue: 0,
    bass: undefined,
    bassSmoothRadius: 1,
    reactiveBarHeightMultiplier: undefined,
    startingPoint: -(0.5 * Math.PI)
};

export function startVisualizer() {
    // Init, connecting yt audio to canvas
    const player = document.getElementById('player');
    const context = new AudioContext();
    const src = context.createMediaElementSource(video);
    globals.visualizer.analyser = context.createAnalyser();

    let canvas, ctx;
    switch(globals.visualizer.place) {
        case 'Navbar': default: canvas = document.getElementById('visualizerNavbarCanvas'); break;
        case 'Album Cover': canvas = document.getElementById('visualizerAlbumCoverCanvas'); break;
    }
    ctx = canvas.getContext('2d');

    src.connect(globals.visualizer.analyser);
    globals.visualizer.analyser.connect(context.destination);

    globals.visualizer.initValues();
    globals.visualizer.getBufferData();

    // Helps set the canvas size to the correct values (navbar width, rectangle or square album cover, etc)
    setInterval(() => {
        visualizerResizeFix();
    }, 1000);
    function visualizerResizeFix() {
        switch(globals.visualizer.place) {
            case 'Navbar': default:
                canvas.width = globals.navBarBg.offsetWidth;
                canvas.height = globals.navBarBg.offsetHeight;
                canvas.style.width = '';
                canvas.style.height = '';
                values.WIDTH = canvas.width;
                values.halfWidth = values.WIDTH / 2;
                values.HEIGHT = canvas.height;

                if(globals.visualizer.startsFrom === 'Center' || globals.visualizer.startsFrom === 'Edges') values.barTotal = values.halfWidth / globals.visualizer.bufferLength;
                else values.barTotal = values.WIDTH / globals.visualizer.bufferLength;
                values.barSpace = values.barTotal * 0.05;
                values.barWidth = values.barTotal * 0.95;
                break;
            case 'Album Cover':
                canvas.style.width = player.offsetWidth + 'px';
                canvas.style.height = player.offsetHeight + 'px';
                canvas.width = player.offsetWidth;
                canvas.height = player.offsetHeight;
                values.WIDTH = canvas.width;
                values.halfWidth = values.WIDTH / 2;
                values.HEIGHT = canvas.height;
                values.halfHeight = values.HEIGHT / 2;

                if(player.playerPageOpen_ === false) { // if miniplayer == true
                    canvas.style.bottom = getComputedStyle(player).bottom; // move the canvas over the miniplayer
                    canvas.style.left = getComputedStyle(player).left;
                }
                else {
                    canvas.style.removeProperty('bottom'); // else completely remove properties because html
                    canvas.style.removeProperty('left');
                }

                if(globals.visualizer.circleEnabled === false) {
                    if(globals.visualizer.startsFrom === 'Center' || globals.visualizer.startsFrom === 'Edges') values.barTotal = values.halfWidth / globals.visualizer.bufferLength;
                    else values.barTotal = values.WIDTH / globals.visualizer.bufferLength;
                    values.barSpace = values.barTotal * 0.05;
                    values.barWidth = values.barTotal * 0.95;
                }
                else if(globals.visualizer.bassBounce.enabled === false) {
                    values.radius = ~~(values.HEIGHT / 4);
                    values.heightModifier = (values.HEIGHT - values.radius) / 2 / 255;
                }
                else values.heightModifier = (values.HEIGHT - ~~(values.HEIGHT / 8)) / 2 / 255;
                break;
            case 'Disabled': break;
        }
    }

    window.addEventListener('resize', visualizerResizeFix);

    function renderFrame() {
        ctx.clearRect(0, 0, values.WIDTH, values.HEIGHT);

        if(video.paused === false && globals.visualizer.place !== 'Disabled') { // If playback is not paused and visualizer is not off
            globals.visualizer.analyser.getByteFrequencyData(globals.visualizer.dataArray); // Get audio data

            if(globals.visualizer.rgb.enabled === true) { // Color cycle effect
                globals.visualizer.rgbData.push(globals.visualizer.rgbData[0]);
                globals.visualizer.rgbData.shift();
            }

            if(globals.visualizer.place === 'Navbar') {
                if(canvas.id !== 'visualizerNavbarCanvas') {
                    canvas = document.getElementById('visualizerNavbarCanvas');
                    ctx = canvas.getContext('2d');
                }
                visualizerNavbar(ctx);
            }
            else if(globals.visualizer.place === 'Album Cover') {
                if(canvas.id !== 'visualizerAlbumCoverCanvas') {
                    canvas = document.getElementById('visualizerAlbumCoverCanvas');
                    ctx = canvas.getContext('2d');
                }
                if(globals.visualizer.circleEnabled === true) visualizerCircle(ctx);
                else visualizerNavbar(ctx);
            }
        }

        requestAnimationFrame(renderFrame);
    }
    renderFrame();
}