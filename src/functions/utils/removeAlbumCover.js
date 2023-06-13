import { elements } from '../../globals/elements';

export function removeAlbumCover(turnOn) {
    elements.player.style.backgroundColor = '#00000001'; // minimal visibility required so shit doesn't break, don't ask
    const songImage = document.getElementById('song-image');
    const songMediaControls = elements.player.children[elements.player.children.length - 2];
    setTimeout(() => {
        if(!turnOn) {
            songImage.style.opacity = 1;
            songMediaControls.style.removeProperty('background');
        }
        else {
            songImage.style.opacity = 0.001;
            songMediaControls.style.background = '#0000';
        }
    }, 500);
}