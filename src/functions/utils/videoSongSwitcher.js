import { elements } from '../../globals/elements';

export function videoSongSwitcher(turnOn) {
    if(!turnOn) {
        elements.player.removeAttribute('has-av-switcher');
        elements.playerPage.removeAttribute('has-av-switcher');
        return;
    }
    elements.player.setAttribute('has-av-switcher');
    elements.playerPage.setAttribute('has-av-switcher');
    try {
        const avSwitch = document.getElementById('av-id');
        if(avSwitch.parentNode.tagName == 'YTMUSIC-NAV-BAR') return;
        const navbar = document.getElementsByTagName('ytmusic-nav-bar')[0];
        navbar.children[1].style.justifyContent = 'space-around';
        navbar.children[1].append(avSwitch);
    }
    catch (err) {
        console.error(err);
    }
}