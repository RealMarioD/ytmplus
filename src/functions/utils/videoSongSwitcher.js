/**
 * @name videoSongSwitcher
 */

import { elements } from '../../globals/elements';
import { thumbnailURL, validThumbnail } from '../visualizer/image';

let clone, avSwitch, forceSongImageInterval;
const videoModeOberserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => { if(mutation.type === 'attributes') handleMutation(mutation); });
});

function handleMutation(mutation) {
    if(mutation.attributeName === 'playback-mode' && mutation.target.getAttribute('playback-mode') !== 'ATV_PREFERRED') mutation.target.setAttribute('playback-mode', 'ATV_PREFERRED');
    if(mutation.attributeName === 'video-mode' && mutation.target.getAttribute('video-mode') !== null) mutation.target.removeAttribute('video-mode');
}

export function videoSongSwitcher(mode) {
    console.log('videoSongSwitcher');
    avSwitch = document.getElementById('av-id');
    if(!avSwitch) return console.error('videoSongSwitcher: avSwitch not found');

    if(mode === 'disabled') {
        // todo later
        getRidOfSwitch();
        videoModeOberserver.disconnect();
        clearInterval(forceSongImageInterval);
    }
    else if(mode === 'ogSwitch') {
        videoModeOberserver.disconnect();
        clearInterval(forceSongImageInterval);
        elements.player.setAttribute('has-av-switcher', true);
        elements.playerPage.setAttribute('has-av-switcher', true);
        avSwitch.style.display = 'none';
        if(clone) return clone.style.display = 'block';
        try {
            if(avSwitch.parentNode.tagName == 'YTMUSIC-NAV-BAR') return;
            const navbar = document.getElementsByTagName('ytmusic-nav-bar')[0];
            navbar.children[1].style.justifyContent = 'space-around';
            clone = avSwitch.cloneNode(true);
            navbar.children[1].append(clone);
            clone.style.display = 'block';
        }
        catch (err) {
            console.error(err);
        }
    }
    else if(mode === 'forceSong') {
        getRidOfSwitch();
        forceSongImageInterval = setInterval(() => {
            console.log('forceSongImageInterval');
            if(validThumbnail === true && elements.songImage.src !== thumbnailURL) elements.songImage.src = thumbnailURL;
        }, 1000);
        elements.player.removeAttribute('video-mode');
        elements.player.setAttribute('playback-mode', 'ATV_PREFERRED'); // song mode
        videoModeOberserver.observe(elements.player, { attributes: true });
    }
}

function getRidOfSwitch() {
    console.log('getRidOfSwitch');
    elements.player.removeAttribute('has-av-switcher');
    elements.playerPage.removeAttribute('has-av-switcher');
    avSwitch.style.display = 'none';
    if(clone) clone.style.display = 'none';
}