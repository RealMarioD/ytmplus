import { visualizer } from '../../globals/visualizer';

const image = new Image();

function currentVideoURL() {
    return document.getElementsByClassName('ytp-title-link yt-uix-sessionlink')[0];
}

function thumbnailChildSrc() {
    try {
        return document.getElementsByClassName('thumbnail style-scope ytmusic-player no-transition')[0].firstElementChild.src;
    }
    catch {
        return undefined;
    }
}

export let imgLoaded = false, lastSavedVideoURL, currentImageURL, widthRatio, heightRatio, quality = 'maxresdefault', loadedQuality;

image.onload = () => {
    if(image.height < 100) { // very likely a 404
        imgLoaded = false;
        if(quality === 'maxresdefault') quality = 'sddefault';
        else if(quality === 'sddefault') quality = 'hqdefault';
        else if(quality === 'hqdefault') quality = 'mqdefault';
        return replaceImageURL();
    }
    heightRatio = image.height / image.width;
    widthRatio = image.width / image.height;
    imgLoaded = true;
    loadedQuality = quality;
    console.log('Image loaded successfully');
    quality = 'maxresdefault';
};

image.onerror = (err) => { // thumbnails return a very small image on 404 so this is mostly for customs
    console.error(err);
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
    if(visualizer.image.type === 'Custom') {
        console.warn('Thumbnail event called with custom image');
        return;
    }
    currentImageURL = thumbnailChildSrc();
    if(!currentImageURL) {
        console.log('thumbnailChildSrc is undefined');
        return;
    }

    if(currentImageURL.indexOf('data') !== 0) {
        console.log('Current image URL is valid');
        if(image.src === currentImageURL) {
            console.log('but is already thumbnail');
            return;
        }
        console.log('Setting it to image source');
        lastSavedVideoURL = currentVideoURL().href;
        return finalize();
    }

    console.log('Current image URL is data, cannot be image source');

    if(lastSavedVideoURL !== currentVideoURL().href) {
        lastSavedVideoURL = currentVideoURL().href;
        console.log(`Changed lastSavedVideoURL to: ${lastSavedVideoURL}`);
    }

    if(!lastSavedVideoURL) {
        console.log('lastSavedVideoURL is empty, currentVideoURL.href is likely undefined');
        return;
    }

    imgLoaded = false;
    currentImageURL = `https://i.ytimg.com/vi/${lastSavedVideoURL.split('v=')[1]}/${quality}.jpg`;
    console.log(`Trying to load with quality: ${quality}`);
    finalize();
}

function customEvent() {
    if(currentImageURL === visualizer.image.customURL) {
        console.log('Custom Image change: URL is the same');
        return;
    }
    currentImageURL = visualizer.image.customURL;
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

    let radiusMultX = visualizer.values.radius,
        radiusMultY = 1; // default visualizer.values for 1:1 aspect ratio

    if(loadedQuality !== 'maxresdefault' && visualizer.image.type !== 'Custom') { // enlarge image to cut off "cinematic bars"
        radiusMultX *= 1.33;
        radiusMultY = widthRatio;
    }
    else if(heightRatio > 1) { // vertical img handling
        radiusMultX *= heightRatio;
        radiusMultY = widthRatio;
    }
    else radiusMultY *= widthRatio; // horizontal img handling

    visualizer.ctx.drawImage(
        image,
        visualizer.values.halfWidth - radiusMultX * radiusMultY,
        visualizer.values.halfHeight - radiusMultX,
        radiusMultX * 2 * radiusMultY,
        radiusMultX * 2
    );
    visualizer.ctx.restore();
}