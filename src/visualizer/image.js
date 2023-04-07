import { visualizer } from '../globals';
import { logplus } from '../debug';
import { ctx, values } from './init';

const image = new Image(),
    thumbnailChildSrc = () => {
        try {
            return document.getElementsByClassName('thumbnail style-scope ytmusic-player no-transition')[0].firstElementChild.src;
        }
        catch {
            return undefined;
        }
    },
    currentVideoURL = () => document.getElementsByClassName('ytp-title-link yt-uix-sessionlink')[0];
export let imgLoaded = false, lastSavedVideoURL, currentURL, wRatio, hRatio, loadSD, quality;

image.onload = () => {
    if(quality === 'maxresdefault' && image.height < 100) { // loaded 404 maxresdefault
        imgLoaded = false;
        loadSD = true;
        return replaceImageURL();
    }
    hRatio = image.height / image.width;
    wRatio = image.width / image.height;
    imgLoaded = true;
};

image.onerror = () => {
    if(visualizer.image.type === 'Custom') logplus('Custom Image URL is not an image');
    else {
        logplus('warn', 'Visualizer Image couldn\'t be loaded.');
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
    currentURL = thumbnailChildSrc();
    if(!currentURL) {
        logplus('thumbnailChildSrc is undefined');
        return;
    }

    if(currentURL.indexOf('data') === 0) {
        logplus('Current song has broken thumbnail, might be a video');

        if(lastSavedVideoURL !== currentVideoURL().href) lastSavedVideoURL = currentVideoURL().href;
        else if(loadSD === false && quality !== 'custom') {
            logplus('Multiple changes with same URL, loadSD is false, quality is not custom');
            return;
        }

        if(!lastSavedVideoURL) {
            logplus('lastSavedVideoURL is empty, currentVideoURL.href is likely undefined');
            return;
        }

        logplus(`lastSavedVideoURL: ${lastSavedVideoURL}`);
        imgLoaded = false;
        if(loadSD === true) {
            quality = 'sddefault';
            logplus(`loadSD is true, working with ${quality}`);
        }
        else quality = 'maxresdefault';
        currentURL = `https://i.ytimg.com/vi/${lastSavedVideoURL.split('v=')[1]}/${quality}.jpg`;
        loadSD = false;
    }
    else if(image.src === currentURL) {
        logplus('Image src is already thumbnail');
        return;
    }
    finalize();
}

function customEvent() {
    if(currentURL === visualizer.image.customURL) {
        logplus('Custom Image change: URL is the same');
        return;
    }
    currentURL = visualizer.image.customURL;
    quality = 'custom';
    finalize();
}

function finalize() {
    logplus('green', `Changed currentURL to: ${currentURL}`);
    imgLoaded = false;
    image.src = currentURL;
}

export function replaceImageURL() {
    if(visualizer.image.type === 'Thumbnail') thumbnailEvent();
    else if(visualizer.image.type === 'Custom') customEvent();
}

const PI2 = Math.PI * 2;
export function drawVisImage() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(values.halfWidth, values.halfHeight, values.radius, 0, PI2, true);
    ctx.closePath();
    ctx.clip();

    let radiusMultX = values.radius, radiusMultY = 1; // default values for 1:1 aspect ratio

    if(quality === 'sddefault') { // enlarge image to cut off "cinematic bars"
        radiusMultX *= 1.33;
        radiusMultY = wRatio;
    }
    else if(hRatio > 1) { // vertical img handling
        radiusMultX *= hRatio;
        radiusMultY = wRatio;
    }
    else radiusMultY *= wRatio; // horizontal img handling

    ctx.drawImage(
        image,
        values.halfWidth - radiusMultX * radiusMultY,
        values.halfHeight - radiusMultX,
        radiusMultX * 2 * radiusMultY,
        radiusMultX * 2
    );
    ctx.restore();
}