import { elements } from '../../globals/elements';

export async function swapMainPanelWithPlaylist(turnOn) {
    if(turnOn) {
        if(elements.mainPanel.parentNode.lastElementChild.id === elements.mainPanel.id) return;
        await elements.mainPanel.parentNode.append(elements.mainPanel);
        elements.playlist.style.margin = '0 var(--ytmusic-player-page-content-gap) 0 0';
    }
    else {
        if(elements.mainPanel.parentNode.firstElementChild.id === elements.mainPanel.id) return;
        await elements.mainPanel.parentNode.prepend(elements.mainPanel);
        elements.playlist.style.margin = '0 0 0 var(--ytmusic-player-page-content-gap)';
    }
}