import { elements } from '../../globals/elements';

export function fixLayout(turnOn) {
    if(turnOn) elements.playerPageDiv.style.paddingTop = '0px';
    else elements.playerPageDiv.style.padding = 'var(--ytmusic-player-page-vertical-padding) var(--ytmusic-player-page-horizontal-padding) 0';
}