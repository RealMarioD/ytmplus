import { createResetWarning } from './resetWarning';
import { sortOutCategories } from './sortOutCategories';
import { createTitlebar } from './titlebar';

export async function manageUI(frame) {
    frame.style.overflow = 'hidden';
    frame.style.width = '1024px';
    frame.style.height = '768px';
    frame.style.inset = '44px 0px 0px 440px';

    const wrapper = document.getElementById('ytmPlusCfg_wrapper');

    const resetLink = await sortOutCategories(wrapper);

    createTitlebar(wrapper, frame);

    createResetWarning(frame, resetLink);
}