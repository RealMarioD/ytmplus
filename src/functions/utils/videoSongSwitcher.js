import { elements } from '../../globals/elements';

export function videoSongSwitcher(turnOn) {
    if(!turnOn) {
        elements.player.removeAttribute('has-av-switcher');
        elements.playerPage.removeAttribute('has-av-switcher');
        return;
    }
    elements.player.setAttribute('has-av-switcher');
    elements.playerPage.setAttribute('has-av-switcher');
}