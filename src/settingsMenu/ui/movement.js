import { ytmpConfig } from '../../ytmpConfig';

export function dragElement(elmnt, frame) {
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
        fixPlacement(frame);
    }
}

export function fixPlacement(frame) {
    // If frame is out of bounds, move it back in
    if(frame.offsetTop < 0) frame.style.top = '0px';
    if(frame.offsetLeft < 0) frame.style.left = '0px';
    if(frame.offsetTop > window.innerHeight - frame.offsetHeight) frame.style.top = (window.innerHeight - frame.offsetHeight) + 'px';
    if(frame.offsetLeft > window.innerWidth - frame.offsetWidth) frame.style.left = (window.innerWidth - frame.offsetWidth) + 'px';

    // If frame is too big to fit on the screen, move it to the top left corner
    if(frame.offsetHeight > window.innerHeight) frame.style.top = '0px';
    if(frame.offsetWidth > window.innerWidth) frame.style.left = '0px';
}

export function expandOrShrink(frame, hideCategoriesBtn) {
    if(!ytmpConfig.shrunk) hideThem(frame, hideCategoriesBtn);
    else showThem(frame, hideCategoriesBtn);
}

function hideThem(frame, hideCategoriesBtn) {
    document.getElementById('categorySelect').style.display = 'none';
    document.getElementById('ytmpDivider').style.display = 'none';
    document.getElementById('currentSettings').style.width = '100%';
    frame.style.aspectRatio = '2.4 / 3';
    ytmpConfig.shrunk = true;
    hideCategoriesBtn.value = '<<';
}

function showThem(frame, hideCategoriesBtn) {
    document.getElementById('categorySelect').style.display = 'flex';
    document.getElementById('ytmpDivider').style.display = 'flex';
    document.getElementById('currentSettings').style.width = '60%';
    frame.style.aspectRatio = '4 / 3';
    ytmpConfig.shrunk = false;
    hideCategoriesBtn.value = '>>';
    setTimeout(() => fixPlacement(frame), 110); // we need to wait for transition to finish which is 100ms plud leeway
}