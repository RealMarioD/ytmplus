import { changeWindowSize } from '../functions/utils/changeWindowSize';
import { extraPlaybackButtons } from '../functions/utils/extraPlaybackButtons';
import { fixLayout } from '../functions/utils/fixLayout';
import { navbarBackgroundChange } from '../functions/utils/navbarBackgroundChange';
import { neverAfk } from '../functions/utils/neverAfk';
import { noPromotions } from '../functions/utils/noPromotions';
import { removeAlbumCover } from '../functions/utils/removeAlbumCover';
import { removeUpgradeButton } from '../functions/utils/removeUpgradeButton';
import { siteBackgroundChange } from '../functions/utils/siteBackgroundChange';
import { skipDisliked } from '../functions/utils/skipDisliked';
import { swapMainPanelWithPlaylist } from '../functions/utils/swapMainPanelWithPlaylist';
import { unlockWidth } from '../functions/utils/unlockWidth';
import { videoSongSwitcher } from '../functions/utils/videoSongSwitcher';

// Collection of functions that are called windowLoad or onSave
export const toCallOnEvents = {
    changeWindowSize,
    extraPlaybackButtons,
    fixLayout,
    navbarBackgroundChange,
    neverAfk,
    noPromotions,
    removeAlbumCover,
    removeUpgradeButton,
    siteBackgroundChange,
    skipDisliked,
    swapMainPanelWithPlaylist,
    unlockWidth,
    videoSongSwitcher
};