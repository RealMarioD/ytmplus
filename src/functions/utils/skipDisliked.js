import { functions } from '../../globals/functions';

export function skipDisliked(turnOn) {
    musicTitleObserver.disconnect();
    if(turnOn === true) musicTitleObserver.observe(document.getElementsByClassName('title style-scope ytmusic-player-bar')[0], { childList: true });
}

// We skip after 5 seconds to let everything load and to not skip not disliked songs (huh?)
function checkDislike() {
    console.log('Checking dislike in 3 seconds...');
    clearTimeout(functions.skipDislikedFunction);

    // If we don't time this out, we get the ability to skip at least 20 songs in a matter of seconds before it realizes it's not supposed to skip
    // also user gets time to undislike the song if they want to
    // maybe timeout could be customizable too
    functions.skipDislikedFunction = setTimeout(async () => {
        const likeButton = await document.getElementById('like-button-renderer');
        if(!likeButton) return console.log('Could not find like button, skipping check');
        if(likeButton.children[0].ariaPressed == 'true') {
            console.log('Song is disliked, skipping');
            return document.getElementsByClassName('next-button style-scope ytmusic-player-bar')[0].click();
        }
        console.log('Song is not disliked, not skipping');
    }, 3000);
}

const musicTitleObserver = new MutationObserver(checkDislike);