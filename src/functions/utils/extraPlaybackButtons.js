import { logger } from '../backend/logger';

export function extraPlaybackButtons(turnOn) {
    const ytmusicApp = document.getElementsByTagName('ytmusic-app')[0];
    if(!ytmusicApp) {
        logger.error('ExtraPlaybackButtons failed: ytmusic-app is undefined');
        return;
    }
    if(ytmusicApp.hasAttribute('is-miniplayer-enabled'))
        newDesign(turnOn);
    else
        oldDesign(turnOn);
}

function newDesign(turnOn) {
    const playerMainControls = document.getElementsByClassName('ytmusicPlayerControlsMainControls');
    if(playerMainControls.length === 0) {
        logger.error('ExtraPlaybackButtons failed: playerMainControls is undefined');
        return;
    }

    const controls = playerMainControls[0].children;

    if(!turnOn) {
        // controls[1].hidden = true; // Playback Rate button, is broken, not my fault
        controls[2].hidden = true;
        controls[5].hidden = true;
    }
    else {
        // controls[1].hidden = false;
        controls[2].hidden = false;
        controls[5].hidden = false;
    }
}

function oldDesign(turnOn) {
    const playbackButtons = document.getElementsByClassName('left-controls-buttons style-scope ytmusic-player-bar')[0].children;
    const playbackRateButton = document.getElementsByTagName('ytmusic-playback-rate-renderer')[0];
    if(!turnOn) {
        playbackButtons[1].hidden = true;
        playbackButtons[4].hidden = true;
        playbackRateButton.hidden = true;
    }
    else {
        playbackButtons[1].hidden = false;
        playbackButtons[4].hidden = false;
        playbackRateButton.hidden = false;
    }
}