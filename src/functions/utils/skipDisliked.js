import { elements } from '../../globals/elements';
import { functions } from '../../globals/functions';

export function skipDisliked(turnOn) {
    const titleHolder = document.getElementsByClassName('title style-scope ytmusic-player-bar')[0];
    titleHolder.removeEventListener('DOMSubtreeModified', checkDislike, false);
    if(!turnOn) return;
    titleHolder.addEventListener('DOMSubtreeModified', checkDislike, false);
}

// We skip after 5 seconds to let everything load and to not skip not disliked songs (huh?)
export function checkDislike() {
    if(elements.dumbFix === 0) return elements.dumbFix++;

    clearTimeout(functions.skipDislikedFunction);
    functions.skipDislikedFunction = setTimeout(() => {
        if(document.getElementById('like-button-renderer').children[0].ariaPressed == 'true') document.getElementsByClassName('next-button style-scope ytmusic-player-bar')[0].click();
    }, 5000);
    elements.dumbFix = 0;
}