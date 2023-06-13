import { injectStyle } from '../functions/backend/injectStyle';
import { elements } from '../globals/elements';
import keyframes from '../css/keyframes.css';
import { noPromotions } from '../functions/utils/noPromotions';
import { ytmpConfig } from '../ytmpConfig';
import { neverAfk } from '../functions/utils/neverAfk';
import { skipDisliked } from '../functions/utils/skipDisliked';
import { fixLayout } from '../functions/utils/fixLayout';
import { extraPlaybackButtons } from '../functions/utils/extraPlaybackButtons';
import { changeBackground } from '../functions/utils/changeBackground';
import { removeAlbumCover } from '../functions/utils/removeAlbumCover';
import { swapMainPanelWithPlaylist } from '../functions/utils/swapMainPanelWithPlaylist';
import { changeUpgradeButton } from '../functions/utils/changeUpgradeButton';
import { setupVisualizer } from '../functions/visualizer/init';
import { createCogFrame } from '../settingsMenu/createCogFrame';

export async function setup() {
    elements.player = await document.getElementById('player');
    elements.playerPage = await document.getElementById('player-page');
    elements.playerPageDiv = elements.playerPage.firstElementChild;
    elements.navBarBg = await document.getElementById('nav-bar-background');
    elements.mainPanel = await document.getElementById('main-panel');

    // Injecting animations for background and clock gradients
    injectStyle(keyframes);

    // Running each function
    neverAfk(ytmpConfig.get('neverAfk'));

    noPromotions(ytmpConfig.get('noPromotions'));

    skipDisliked(ytmpConfig.get('skipDisliked'));

    fixLayout(ytmpConfig.get('fixLayout'));

    extraPlaybackButtons(ytmpConfig.get('extraPlaybackButtons'));

    changeBackground(ytmpConfig.get('changeBackground'), true);

    // These functions are timed out so needed elements can load
    setTimeout(async () => {
        removeAlbumCover(ytmpConfig.get('removeAlbumCover'));

        swapMainPanelWithPlaylist(ytmpConfig.get('swapMainPanelWithPlaylist'));

        elements.upgradeButton = await document.getElementsByClassName('tab-title style-scope ytmusic-pivot-bar-item-renderer')[3];
        elements.originalUpgradeText = elements.upgradeButton.textContent;
        changeUpgradeButton(ytmpConfig.get('changeUpgradeButton'));
    }, 500);

    setupVisualizer();

    // Adds a settings button on the navbar
    createCogFrame();
}