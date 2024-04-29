// Complete redo of image.js
// What we need to do:
// - Always get thumbnail image, even if custom image is set
// - Save the image URL to a variable, thumbnail and custom image should be saved to different variables

import { visualizer } from '../../globals/visualizer';

let quality = 'maxresdefault', widthRatio;
export let validThumbnail = false, imgLoaded = false, thumbnailURL;

function ytimgBuilder(videoID) {
    if(!videoID) return undefined;
    return `https://i.ytimg.com/vi/${videoID}/${quality}.jpg`;
}

const image = new Image();
image.onload = () => {
    if(image.height < 100 && quality !== 'mqdefault') { // thumbnails return a very small image on 404
        imgLoaded = false;
        if(quality === 'maxresdefault') quality = 'sddefault';
        else if(quality === 'sddefault') quality = 'hqdefault';
        else if(quality === 'hqdefault') quality = 'mqdefault';
        return replaceImageURL();
    }
    widthRatio = image.width / image.height;
    imgLoaded = true;
    console.log('Image loaded successfully');
    quality = 'maxresdefault';
};
image.onerror = (err) => { // we will most likely only get this is for custom images
    console.error(err);
    if(visualizer.image.type === 'Custom') console.log('Custom Image URL is not an image');
    else {
        console.log('Visualizer Image couldn\'t be loaded. See above.');
        return;
    }
    visualizer.image.customURL = 'https://imgur.com/Nkj0d6D.png';
    replaceImageURL();
};

const testImage = new Image();
testImage.onload = () => {
    if(testImage.height < 100 && quality !== 'mqdefault') { // very likely a 404
        if(quality === 'maxresdefault') quality = 'sddefault';
        else if(quality === 'sddefault') quality = 'hqdefault';
        else if(quality === 'hqdefault') quality = 'mqdefault';
        return testForWorkingLink();
    }
    console.log('Test Image loaded successfully');
    if(visualizer.image.type !== 'Thumbnail') return;
    console.log('Setting thumbnailURL to testImage.src');
    image.src = thumbnailURL;
    validThumbnail = true;
};

export function replaceImageURL() {
    console.log('replaceImageURL');
    thumbnailURL = thumbnailChildSrc();
    if(!thumbnailURL) console.log('thumbnailURL is undefined, ytmusic sucks');

    testForWorkingLink(); // we save this no matter what, because f*ck the way ytm handles everything, see src/functions/utils/videoSongSwitcher.js for spaghetti

    if(visualizer.image.type === 'Custom') image.src = visualizer.image.customURL;
}

function testForWorkingLink() {
    thumbnailURL = ytimgBuilder(currentVideoID());
    if(!thumbnailURL) return console.log('thumbnailURL is undefined, ytimgBuilder failed');
    testImage.src = thumbnailURL;
    console.log(`testImage.src set to crafted thumbnailURL: ${thumbnailURL}`);
}

export function currentVideoURLHolder() {
    return document.getElementsByClassName('ytp-title-link yt-uix-sessionlink')[0];
}

function currentVideoID() {
    const urlResults = currentVideoURLHolder().href.match(/(?:v=)([^&]*)/i);
    if(urlResults === null || urlResults.length < 2) return undefined;
    return urlResults[1];
}
const videoIDObserver = new MutationObserver((changes) => {
    changes.forEach(change => {
        if(change.attributeName === 'href' && currentVideoURLHolder().href != undefined) replaceImageURL();
    });
});

export function observeVideoID() {
    videoIDObserver.observe(currentVideoURLHolder(), { attributes: true });
}

function thumbnailChildSrc() {
    try {
        return document.getElementsByClassName('thumbnail style-scope ytmusic-player no-transition')[0].firstElementChild.src;
    }
    catch {
        return undefined;
    }
}

const PI2 = Math.PI * 2;
export function drawVisImage() {
    visualizer.ctx.save();
    visualizer.ctx.beginPath();
    visualizer.ctx.arc(visualizer.values.halfWidth, visualizer.values.halfHeight, visualizer.values.radius, 0, PI2, true);
    visualizer.ctx.closePath();
    visualizer.ctx.clip();

    const radiusMultX = visualizer.values.radius * 1.175,
        radiusMultY = widthRatio; // default visualizer.values for 1:1 aspect ratio

    // if(loadedQuality !== 'maxresdefault' && visualizer.image.type !== 'Custom') { // enlarge image to cut off "cinematic bars"
    //     radiusMultX *= 1.33;
    //     radiusMultY = widthRatio;
    // }
    // else if(heightRatio > 1) { // vertical img handling
    //     radiusMultX *= heightRatio;
    //     radiusMultY = widthRatio;
    // }
    // else radiusMultY *= widthRatio; // horizontal img handling

    visualizer.ctx.drawImage(
        image,
        visualizer.values.halfWidth - radiusMultX * radiusMultY,
        visualizer.values.halfHeight - radiusMultX,
        radiusMultX * 2 * radiusMultY,
        radiusMultX * 2
    );
    visualizer.ctx.restore();
}