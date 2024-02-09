import { injectElement } from '../../functions/backend/injectElement';
import { ytmpConfig } from '../../ytmpConfig';
import { dragElement, expandOrShrink } from './movement';

export async function createTitlebar(wrapper, frame) {
    // Creating titlebar
    const titlebar = await injectElement('div', 'ytmPlusCfg_titlebar', wrapper, undefined, undefined, true);
    const closeButton = await injectElement('input', 'titlebar_x', titlebar, 'titlebarButtons');
    closeButton.type = 'button';
    closeButton.value = '✕';
    closeButton.addEventListener('click', () => {
        ytmpConfig.close();
        ytmpConfig.shrunk = false;
    });

    // Support button
    const kofi = await injectElement('div', 'supportMePls', titlebar, 'titlebarButtons');
    const kofiA = await injectElement('a', 'goToKofi', kofi);
    kofiA.innerHTML = '<img src="https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/61e111774d3a2f67c827cd25_Frame%205.png">';
    kofiA.href = 'https://ko-fi.com/realmariod';
    kofiA.title = 'Buy me a Coffee!';
    kofiA.target = '_blank';

    // Hide categories button
    const hideCategoriesBtn = await injectElement('input', 'hideCategories', titlebar, 'titlebarButtons');
    hideCategoriesBtn.type = 'button';
    hideCategoriesBtn.value = '>>';
    hideCategoriesBtn.addEventListener('click', () => expandOrShrink(frame, hideCategoriesBtn));

    // Adding draggable part to titlebar now so that you can actually click X and support
    const draggablePart = await injectElement('div', 'titlebar_draggable', titlebar);
    const titlebarIcon = await injectElement('img', 'titlebar_icon', draggablePart);
    titlebarIcon.src = 'https://i.imgur.com/gfg6VLJ.png';
    const titlebarTitle = await injectElement('span', 'titlebar_title', draggablePart);
    // eslint-disable-next-line no-undef
    titlebarTitle.innerHTML = `ytmPlus ${vNumber}`;
    dragElement(draggablePart, frame);
}