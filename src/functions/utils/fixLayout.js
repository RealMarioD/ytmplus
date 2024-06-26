import { elements } from '../../globals/elements';
import { functions } from '../../globals/functions';
import { injectStyle } from '../backend/injectStyle';
import layoutOverrides from '../../css/layoutOverrides.css';

let layoutCss, moviePlayer;
export function fixLayout(turnOn) {
    if(!moviePlayer) moviePlayer = document.getElementById('movie_player');
    if(!turnOn) {
        clearInterval(functions.fixLayout);
        elements.player.style.removeProperty('flex');
        // elements.player.style.removeProperty('width');
        elements.player.style.removeProperty('margin');
        elements.playerPageDiv.style.removeProperty('padding');
        elements.mainPanel.style.removeProperty('align-items');
        elements.mainPanel.style.removeProperty('justify-content');
        moviePlayer.style.removeProperty('background');
        try {
            layoutCss = layoutCss.remove();
        }
        catch {}
        return;
    }

    functions.fixLayout = setInterval(() => {
        if(elements.player.style.margin !== '0px') elements.player.style.margin = '0px';
    }, 1000);
    elements.player.style.flex = '0.75';
    elements.playerPageDiv.style.padding = '0px var(--ytmusic-player-page-horizontal-padding)';
    elements.mainPanel.style.alignItems = 'center';
    elements.mainPanel.style.justifyContent = 'center';
    elements.playlist.style.justifyContent = 'center';
    moviePlayer.style.background = 'rgba(0,0,0,0.001)';
    if(!layoutCss) layoutCss = injectStyle(layoutOverrides);
}