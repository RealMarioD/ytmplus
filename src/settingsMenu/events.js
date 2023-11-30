import { siteBackgroundChange } from '../functions/utils/siteBackgroundChange';
import { removeUpgradeButton } from '../functions/utils/removeUpgradeButton';
import { neverAfk } from '../functions/utils/neverAfk';
import { noPromotions } from '../functions/utils/noPromotions';
import { skipDisliked } from '../functions/utils/skipDisliked';
import { extraPlaybackButtons } from '../functions/utils/extraPlaybackButtons';
import { fixLayout } from '../functions/utils/fixLayout';
import { removeAlbumCover } from '../functions/utils/removeAlbumCover';
import { swapMainPanelWithPlaylist } from '../functions/utils/swapMainPanelWithPlaylist';
import { startVisualizer } from '../functions/visualizer/init';
import { ytmpConfig } from '../ytmpConfig';
import { manageUI } from './ui/init';
import { configFields } from './fields';
import { setupAutosave } from './ui/autosave';
import { navbarBackgroundChange } from '../functions/utils/navbarBackgroundChange';
import { videoSongSwitcher } from '../functions/utils/videoSongSwitcher';
import { fixPlacemenet } from './ui/titlebar';

export function openEvent(doc, win, frame) { // open function is mostly customizing settings UI
    // Quick hack for color fields
    for(const key in configFields) {
        if(configFields[key].type !== 'color') continue;
        document.getElementById(`ytmPlusCfg_field_${key}`).type = 'color';
        if(key === 'changeShortcut') configFields[key].label += ytmpConfig.get('shortcut').split('|')[1];
    }

    manageUI(frame);

    setupAutosave();

    setTimeout(() => {
        ytmpConfig.frame.style.transition = '0.1s';
        fixPlacemenet(frame);
    }, 100);
}

export function closeEvent() {
    ytmpConfig.frame.style.transition = '0s';
}

export function saveEvent() {
    // Updates updateable stuff on save
    navbarBackgroundChange(ytmpConfig.get('navbarBackgroundChange'));

    siteBackgroundChange(ytmpConfig.get('siteBackgroundChange'));

    removeUpgradeButton(ytmpConfig.get('removeUpgradeButton'));

    neverAfk(ytmpConfig.get('neverAfk'));

    noPromotions(ytmpConfig.get('noPromotions'));

    skipDisliked(ytmpConfig.get('skipDisliked'));

    extraPlaybackButtons(ytmpConfig.get('extraPlaybackButtons'));

    fixLayout(ytmpConfig.get('fixLayout'));

    videoSongSwitcher(ytmpConfig.get('videoSongSwitcher'));

    removeAlbumCover(ytmpConfig.get('removeAlbumCover'));

    swapMainPanelWithPlaylist(ytmpConfig.get('swapMainPanelWithPlaylist'));

    startVisualizer();

    window.dispatchEvent(new Event('resize'));
}