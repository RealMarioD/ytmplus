import { elements } from '../../globals/elements';

let clone;
export function videoSongSwitcher(turnOn) {
    const avSwitch = document.getElementById('av-id');
    if(!turnOn) {
        elements.player.removeAttribute('has-av-switcher');
        elements.playerPage.removeAttribute('has-av-switcher');
        avSwitch.style.display = 'none';
        if(clone) clone.style.display = 'none';
        return;
    }
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