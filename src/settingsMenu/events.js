import { changeBackground } from '../functions/utils/changeBackground';
import { changeUpgradeButton } from '../functions/utils/changeUpgradeButton';
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
import { injectElement } from '../functions/backend/injectElement';
import headerSVG from './ui/ytmpTitle.svg';

export function openEvent(doc, win, frame) { // open function is mostly customizing settings UI
    // Every color input we want has to be 'manually set' (ytmpConfig's customType would come in handy but how the hell do it work)
    const colorTypeFields = [
        'bgColor',
        'bgGradient',
        'clockColor',
        'clockGradientColor',
        'visualizerColor'
    ];
    for(let i = 0; i < colorTypeFields.length; i++) doc.getElementById('ytmPlusCfg_field_' + colorTypeFields[i]).type = 'color';

    manageUI(frame);

    // Live change for input tags + Adding info to int/float settings
    const inputs = doc.getElementsByTagName('input');
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', () => ytmpConfig.save());
        if(!isNaN(parseInt(inputs[i].value, 10))) {
            const fieldSettings = ytmpConfig.fields[inputs[i].id.split('_')[2]].settings;
            inputs[i].title = `type: ${fieldSettings.type} | default: ${fieldSettings.default} | ${fieldSettings.min} . . ${fieldSettings.max}`;
        }
    }
    // Live change for select tags
    const selects = doc.getElementsByTagName('select');
    for(let i = 0; i < selects.length; i++) selects[i].addEventListener('change', () => ytmpConfig.save());

    // Live change for textarea tags + 1 row height
    const textareas = doc.getElementsByTagName('textarea');
    for(let i = 0; i < textareas.length; i++) {
        textareas[i].parentElement.style.alignItems = 'stretch';
        textareas[i].previousSibling.style.padding = 0;
        textareas[i].addEventListener('change', () => ytmpConfig.save());
    }

    // Header title svg
    const title = doc.getElementById('ytmPlusCfg_header');
    title.innerHTML = headerSVG;
    const vnumberHeader = injectElement('span', 'vnumber_header', title);
    // eslint-disable-next-line no-undef
    vnumberHeader.innerHTML = vNumber; // vNumber hacked in with metadataBuilder

    doc.addEventListener('keydown', event => {
        if(event.key == 'Escape') ytmpConfig.close();
    });
}

export function saveEvent() {
    // Updates updateable stuff on save
    changeBackground(ytmpConfig.get('changeBackground'));

    changeUpgradeButton(ytmpConfig.get('changeUpgradeButton'));

    neverAfk(ytmpConfig.get('neverAfk'));

    noPromotions(ytmpConfig.get('noPromotions'));

    skipDisliked(ytmpConfig.get('skipDisliked'));

    extraPlaybackButtons(ytmpConfig.get('extraPlaybackButtons'));

    fixLayout(ytmpConfig.get('fixLayout'));

    removeAlbumCover(ytmpConfig.get('removeAlbumCover'));

    swapMainPanelWithPlaylist(ytmpConfig.get('swapMainPanelWithPlaylist'));

    startVisualizer();

    window.dispatchEvent(new Event('resize'));
}