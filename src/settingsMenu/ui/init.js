import { injectElement } from '../../functions/backend/injectElement';
import { createResetWarning } from './resetWarning';
import { sortOutCategories } from './sortOutCategories';
import { sortSubs } from './sortSubs';
import { createTitlebar } from './titlebar';
import headerSVG from './ytmpTitle.svg';

export async function manageUI(frame) {
    frame.style.overflow = 'hidden';
    frame.style.aspectRatio = '4 / 3';
    frame.style.removeProperty('width');
    frame.style.removeProperty('height');
    frame.style.removeProperty('max-width');
    frame.style.removeProperty('max-height');
    frame.style.inset = '44px 0px 0px 440px';

    const wrapper = document.getElementById('ytmPlusCfg_wrapper');

    // Header title svg
    const title = document.getElementById('ytmPlusCfg_header');
    title.innerHTML = headerSVG;
    const vnumberHeader = injectElement('span', 'vnumber_header', title);
    // eslint-disable-next-line no-undef
    vnumberHeader.innerHTML = vNumber; // vNumber hacked in with metadataBuilder

    const resetLink = await sortOutCategories(wrapper);

    sortSubs();

    createTitlebar(wrapper, frame);

    createResetWarning(frame, resetLink);
}