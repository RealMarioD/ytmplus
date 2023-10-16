import { injectElement } from '../../functions/backend/injectElement';
import { ytmpConfig } from '../../ytmpConfig';

export async function createTitlebar(wrapper, frame) {
    // Creating titlebar
    const titlebar = await injectElement('div', 'ytmPlusCfg_titlebar', wrapper, undefined, undefined, true);
    const closeButton = await injectElement('input', 'titlebar_x', titlebar);
    closeButton.type = 'button';
    closeButton.value = 'X';
    closeButton.addEventListener('click', () => {
        ytmpConfig.close();
    });

    // Support button
    const kofi = injectElement('div', 'supportMePls', titlebar);
    const kofiA = injectElement('a', 'goToKofi', kofi);
    kofiA.innerHTML = '<img src="https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/61e111774d3a2f67c827cd25_Frame%205.png">';
    kofiA.href = 'https://ko-fi.com/realmariod';
    kofiA.title = 'Buy me a Coffee!';
    kofiA.target = '_blank';

    // Adding draggable part to titlebar now so that you can actually click X and support
    const draggablePart = await injectElement('div', 'titlebar_draggable', titlebar);
    const titlebarIcon = await injectElement('img', 'titlebar_icon', draggablePart);
    titlebarIcon.src = 'https://i.imgur.com/gfg6VLJ.png';
    const titlebarTitle = await injectElement('span', 'titlebar_title', draggablePart);
    // eslint-disable-next-line no-undef
    titlebarTitle.innerHTML = `ytmPlus ${vNumber}`;
    dragElement(draggablePart, frame);
}

function dragElement(elmnt, frame) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
        frame.style.transition = '0s';
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.addEventListener('mouseup', closeDragElement);
        // call a function whenever the cursor moves:
        document.addEventListener('mousemove', elementDrag);
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = (pos3 - e.clientX);
        pos2 = (pos4 - e.clientY);
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        frame.style.top = (frame.offsetTop - pos2) + 'px';
        frame.style.left = (frame.offsetLeft - pos1) + 'px';
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
        frame.style.transition = '0.1s';
        if(frame.offsetTop < 0) frame.style.top = '0px';
        if(frame.offsetTop + frame.clientHeight > window.innerHeight) frame.style.top = window.innerHeight - frame.clientHeight + 'px';
        if(frame.offsetLeft < 0) frame.style.left = '0px';
        if(frame.offsetLeft + frame.clientWidth > window.innerWidth) frame.style.left = window.innerWidth - frame.clientWidth + 'px';
    }
}
