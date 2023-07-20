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
// import { changeUpgradeButton } from '../functions/utils/changeUpgradeButton';
import { setupVisualizer } from '../functions/visualizer/init';
import { createCogFrame } from '../settingsMenu/createCogFrame';
import { changeNavbarBackground } from '../functions/utils/changeNavbarBackground';
import { videoSongSwitcher } from '../functions/utils/videoSongSwitcher';
import { removeUpgradeButton } from '../functions/utils/removeUpgradeButton';

export async function setup() {
    elements.player = await document.getElementById('player');
    elements.playerPage = await document.getElementById('player-page');
    elements.playerPageDiv = elements.playerPage.firstElementChild;
    elements.navBarBg = await document.getElementById('nav-bar-background');
    elements.mainPanel = await document.getElementById('main-panel');
    const playlistFinder = await document.getElementsByClassName('side-panel modular style-scope ytmusic-player-page');
    elements.playlist = playlistFinder[0];

    // Injecting animations for background and clock gradients
    injectStyle(keyframes);

    // Running each function
    neverAfk(ytmpConfig.get('neverAfk'));

    noPromotions(ytmpConfig.get('noPromotions'));

    skipDisliked(ytmpConfig.get('skipDisliked'));

    fixLayout(ytmpConfig.get('fixLayout'));

    extraPlaybackButtons(ytmpConfig.get('extraPlaybackButtons'));

    videoSongSwitcher(ytmpConfig.get('videoSongSwitcher'));

    changeNavbarBackground(ytmpConfig.get('changeNavbarBackground'));

    changeBackground(ytmpConfig.get('changeBackground'), true);

    // These functions are timed out so needed elements can load
    setTimeout(async () => {
        try {
            const guides = await document.getElementsByTagName('ytmusic-guide-section-renderer');
            elements.bigGuide = guides[0].children[2];
            elements.miniGuide = guides[2].children[2];
        }
        catch {
            if(!elements.miniGuide) console.warn('Could not find miniGuide!');
        }

        // Adds a settings button on the navbar
        createCogFrame();

        removeAlbumCover(ytmpConfig.get('removeAlbumCover'));

        swapMainPanelWithPlaylist(ytmpConfig.get('swapMainPanelWithPlaylist'));

        removeUpgradeButton(ytmpConfig.get('removeUpgradeButton'));
    }, 500);

    setupVisualizer();
}