// Jesus fucking christ can we rework this bullshit
import { visualizer } from '../../globals/visualizer';

const image = new Image(),
    currentVideoURL = () => document.getElementsByClassName('ytp-title-link yt-uix-sessionlink')[0];

function thumbnailChildSrc() {
    try {
        return document.getElementsByClassName('thumbnail style-scope ytmusic-player no-transition')[0].firstElementChild.src;
    }
    catch {
        return undefined;
    }
}
export let imgLoaded = false, lastSavedVideoURL, currentImageURL, wRatio, hRatio, toLoad = -1, quality;

image.onload = () => {
    if(image.height < 100) { // very likely a 404
        imgLoaded = false;
        if(quality === 'maxresdefault') {
            toLoad = 0;
            return replaceImageURL();
        }
        else if(quality === 'sddefault') {
            toLoad = 1;
            return replaceImageURL();
        }
        else if(quality === 'hqdefault') {
            toLoad = 2;
            return replaceImageURL();
        }
    }
    hRatio = image.height / image.width;
    wRatio = image.width / image.height;
    imgLoaded = true;
};

image.onerror = () => { // thumbnails return a very small image on 404 so this is mostly for customs
    if(visualizer.image.type === 'Custom') console.log('Custom Image URL is not an image');
    else {
        console.log('Visualizer Image couldn\'t be loaded.');
        return;
    }
    visualizer.image.customURL = 'https://imgur.com/Nkj0d6D.png';
    replaceImageURL();
};

const observer = new MutationObserver(changes => {
    changes.forEach(change => {
        if(change.attributeName === 'href' && currentVideoURL().href != undefined) replaceImageURL();
    });
});
setTimeout(() => observer.observe(currentVideoURL(), { attributes: true }), 1000);

function thumbnailEvent() {
    currentImageURL = thumbnailChildSrc();
    if(!currentImageURL) {
        console.log('thumbnailChildSrc is undefined');
        return;
    }

    if(currentImageURL.indexOf('data') === 0) {
        console.log('Current song has broken thumbnail');

        if(lastSavedVideoURL !== currentVideoURL().href) lastSavedVideoURL = currentVideoURL().href;
        else if(toLoad < 0 && quality !== 'custom') {
            console.log('Multiple changes with same URL, not asking for small resolution, quality is not custom');
            return;
        }

        if(!lastSavedVideoURL) {
            console.log('lastSavedVideoURL is empty, currentVideoURL.href is likely undefined');
            return;
        }

        console.log(`Changed lastSavedVideoURL to: ${lastSavedVideoURL}`);
        imgLoaded = false;
        if(toLoad === 0) quality = 'sddefault';
        else if(toLoad === 1) quality = 'hqdefault';
        else if(toLoad === 2) quality = 'mqdefault';
        else quality = 'maxresdefault';
        console.log(`Image quality: ${quality}`);
        currentImageURL = `https://i.ytimg.com/vi/${lastSavedVideoURL.split('v=')[1]}/${quality}.jpg`;
        toLoad = -1;
    }
    else if(image.src === currentImageURL) {
        console.log('Image src is already thumbnail');
        return;
    }
    lastSavedVideoURL = currentVideoURL().href;
    finalize();
}

function customEvent() {
    if(currentImageURL === visualizer.image.customURL) {
        console.log('Custom Image change: URL is the same');
        return;
    }
    currentImageURL = visualizer.image.customURL;
    quality = 'custom';
    finalize();
}

function finalize() {
    console.log(`Changed currentImageURL to: ${currentImageURL}`);
    imgLoaded = false;
    image.src = currentImageURL;
}

export function replaceImageURL() {
    if(visualizer.circleEnabled === false) return;
    if(visualizer.image.type === 'Thumbnail') thumbnailEvent();
    else if(visualizer.image.type === 'Custom') customEvent();
}

const PI2 = Math.PI * 2;
export function drawVisImage() {
    visualizer.ctx.save();
    visualizer.ctx.beginPath();
    visualizer.ctx.arc(visualizer.values.halfWidth, visualizer.values.halfHeight, visualizer.values.radius, 0, PI2, true);
    visualizer.ctx.closePath();
    visualizer.ctx.clip();

    let radiusMultX = visualizer.values.radius, radiusMultY = 1; // default visualizer.values for 1:1 aspect ratio

    if(quality === 'sddefault') { // enlarge image to cut off "cinematic bars"
        radiusMultX *= 1.33;
        radiusMultY = wRatio;
    }
    else if(hRatio > 1) { // vertical img handling
        radiusMultX *= hRatio;
        radiusMultY = wRatio;
    }
    else radiusMultY *= wRatio; // horizontal img handling

    visualizer.ctx.drawImage(
        image,
        visualizer.values.halfWidth - radiusMultX * radiusMultY,
        visualizer.values.halfHeight - radiusMultX,
        radiusMultX * 2 * radiusMultY,
        radiusMultX * 2
    );
    visualizer.ctx.restore();
}