export function extraPlaybackButtons(turnOn) {
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