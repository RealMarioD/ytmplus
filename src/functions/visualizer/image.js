import { visualizer } from '../../globals/visualizer';

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
    currentURL = thumbnailChildSrc();
    if(!currentURL) {
        console.log('thumbnailChildSrc is undefined');
        return;
    }

    if(currentURL.indexOf('data') === 0) {
        console.log('Current song has broken thumbnail, might be a video');

        if(lastSavedVideoURL !== currentVideoURL().href) lastSavedVideoURL = currentVideoURL().href;
        else if(loadSD === false && quality !== 'custom') {
            console.log('Multiple changes with same URL, loadSD is false, quality is not custom');
            return;
        }

        if(!lastSavedVideoURL) {
            console.log('lastSavedVideoURL is empty, currentVideoURL.href is likely undefined');
            return;
        }

        console.log(`Changed lastSavedVideoURL to: ${lastSavedVideoURL}`);
        imgLoaded = false;
        if(loadSD === true) {
            quality = 'sddefault';
            console.log(`loadSD is true, working with ${quality}`);
        }
        else quality = 'maxresdefault';
        currentURL = `https://i.ytimg.com/vi/${lastSavedVideoURL.split('v=')[1]}/${quality}.jpg`;
        loadSD = false;
    }
    else if(image.src === currentURL) {
        console.log('Image src is already thumbnail');
        return;
    }
    lastSavedVideoURL = currentVideoURL().href;
    finalize();
}

function customEvent() {
    if(currentURL === visualizer.image.customURL) {
        console.log('Custom Image change: URL is the same');
        return;
    }
    currentURL = visualizer.image.customURL;
    quality = 'custom';
    finalize();
}

function finalize() {
    console.log(`Changed currentURL to: ${currentURL}`);
    imgLoaded = false;
    image.src = currentURL;
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