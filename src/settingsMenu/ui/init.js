import { createResetWarning } from './resetWarning';
import { sortOutCategories } from './sortOutCategories';
import { createTitlebar } from './titlebar';

export async function manageUI(frame) {
    frame.style.overflow = 'hidden';
    frame.style.aspectRatio = '4 / 3';
    frame.style.removeProperty('width');
    frame.style.removeProperty('height');
    frame.style.removeProperty('max-width');
    frame.style.removeProperty('max-height');
    frame.style.inset = '44px 0px 0px 440px';

    const wrapper = document.getElementById('ytmPlusCfg_wrapper');

    const resetLink = await sortOutCategories(wrapper);

    createTitlebar(wrapper, frame);

    createResetWarning(frame, resetLink);
}