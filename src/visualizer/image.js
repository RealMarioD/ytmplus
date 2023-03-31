import { visualizer } from '../globals';
import { logplus } from '../debug';
import { ctx, values } from './init';

const image = new Image(),
    thumbnailChild = () => document.getElementById('thumbnail').firstElementChild,
    currentSongURL = () => document.getElementsByClassName('ytp-title-link yt-uix-sessionlink')[0];
let imgLoaded = false, fixedVideoURL, currentURL, wRatio, hRatio, loadSD, quality;

image.onload = () => {
    if(image.height < 100) {
        imgLoaded = false;
        loadSD = true;
        return replaceImageURL();
    }
    hRatio = image.height / image.width;
    wRatio = image.width / image.height;
    imgLoaded = true;
};
image.onerror = () => {
    logplus('warn', 'Visualizer Image couldn\'t be loaded.');
    currentURL = 'https://imgur.com/Nkj0d6D.png';
    visualizer.image.customURL = currentURL;
};

const observer = new MutationObserver(changes => {
    changes.forEach(change => {
        if(change.attributeName.includes('href')) replaceImageURL();
    });
});
setTimeout(() => {
    logplus('Observer set to motion');
    observer.observe(currentSongURL(), { attributes: true });
}, 1000);

export function replaceImageURL() {
    if(visualizer.image.type === 'Thumbnail') {
        currentURL = thumbnailChild().src;
        if(currentURL.indexOf('data') === 0) {
            imgLoaded = false;
            fixedVideoURL = currentSongURL().href;
            if(loadSD === true) {
                quality = 'sddefault';
                logplus('warn', 'replaceImageURL called with loadSD: true');
            }
            else quality = 'maxresdefault';
            currentURL = `https://i.ytimg.com/vi/${fixedVideoURL.split('v=')[1]}/${quality}.jpg`;
            loadSD = false;
            logplus(fixedVideoURL, currentURL);
        }
    }
    else if(visualizer.image.type === 'Custom') currentURL = visualizer.image.customURL;
    else return;
    imgLoaded = false;
    image.src = currentURL;
}

export function handleImage() {
    if(imgLoaded === true) drawVisImage();
}

function drawVisImage() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(values.WIDTH / 2, values.HEIGHT / 2, values.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    if(hRatio === 1) ctx.drawImage(image, values.halfWidth - values.radius, values.halfHeight - values.radius, values.radius * 2, values.radius * 2);
    else if(quality === 'sddefault') {
        const radiusMult = values.radius * 1.25;
        ctx.drawImage(image, values.halfWidth - radiusMult * wRatio, values.halfHeight - radiusMult, radiusMult * 2 * wRatio, radiusMult * 2);
    }
    else ctx.drawImage(image, values.halfWidth - values.radius * wRatio, values.halfHeight - values.radius, values.radius * 2 * wRatio, values.radius * 2);
    ctx.restore();
}