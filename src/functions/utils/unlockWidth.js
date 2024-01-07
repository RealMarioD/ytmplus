import { elements } from '../../globals/elements';

export function unlockWidth(option) {
    if(option === 'Playlist') {
        elements.playlist.style.maxWidth = 'unset';
        elements.player.style.removeProperty('max-width');
    }
    else if(option === 'Album Cover') {
        elements.player.style.maxWidth = 'unset';
        elements.playlist.style.removeProperty('max-width');
    }
    else if(option === 'Both') {
        elements.player.style.maxWidth = 'unset';
        elements.playlist.style.maxWidth = 'unset';
    }
    else {
        elements.player.style.removeProperty('max-width');
        elements.playlist.style.removeProperty('max-width');
    }
}