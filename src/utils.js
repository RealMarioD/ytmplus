import { globals } from './globals';
import { GM_config } from './GM/GM_config';

export function promoEnable(turnOn) {
    let popup;
    clearInterval(globals.noPromoFunction);
    if(!turnOn) return;
    globals.noPromoFunction = setInterval(() => {
        popup = document.getElementsByTagName('ytmusic-mealbar-promo-renderer');
        if(popup.length > 0) {
            popup[0].remove();
            console.log('ytmPlus: Removed a promotion.');
        }
    }, 1000);
}

export function afkEnable(turnOn) { // Credit to q1k - https://greasyfork.org/en/users/1262-q1k
    clearInterval(globals.noAfkFunction);
    if(!turnOn) return;
    globals.noAfkFunction = setInterval(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 }));
        console.log('ytmPlus: Nudged the page so user is not AFK.');
    }, 15000);
}

export function clockEnable(mode) {
    let currentTime;
    clearInterval(globals.clockFunction);
    if(mode === 'Original') {
        globals.upgradeButton.textContent = globals.originalUpgradeText;
        globals.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
    }
    else if(mode === 'Digital Clock') {
        globals.clockFunction = setInterval(() => {
            currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            globals.upgradeButton.textContent = currentTime;
        }, 1000);
        globals.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
    }
    else {
        globals.upgradeButton.textContent = '';
        globals.upgradeButton.parentElement.style.margin = '0px';
    }
    const a = globals.upgradeButton.style;
    a.background = mode != 'Digital Clock' ? '' : `linear-gradient(to right, ${GM_config.get('clockColor')} 0%, ${GM_config.get('clockGradient') === true ? GM_config.get('clockGradientColor') : GM_config.get('clockColor')} 50%, ${GM_config.get('clockColor')} 100%`;
    a.backgroundSize = mode != 'Digital Clock' ? '' : '200% auto';
    a.backgroundClip = mode != 'Digital Clock' ? '' : 'text';
    a.textFillColor = mode != 'Digital Clock' ? '' : 'transparent';
    a.webkitBackgroundClip = mode != 'Digital Clock' ? '' : 'text';
    a.webkitTextFillColor = mode != 'Digital Clock' ? '' : 'transparent';
    a.fontSize = mode != 'Digital Clock' ? '20px' : '50px';
    a.animation = mode != 'Digital Clock' ? '' : 'clockGradient 2s linear infinite normal';
}

export function changeBackground(option, firstRun) {
    if(option === false) {
        if(document.body.style.backgroundImage !== '') {
            document.body.style.backgroundColor = '#000000';
            document.body.style.backgroundImage = '';
            globals.playerPageDiv.style.backgroundColor = '#000000';
            globals.playerPageDiv.style.backgroundImage = '';
        }
        return;
    }
    try {
        if(firstRun === true) document.getElementsByTagName('ytmusic-browse-response')[0].children[0].remove();
        document.getElementsByClassName('immersive-background style-scope ytmusic-browse-response')[0].children[0].remove();
    }
    catch { }
    document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';
    addFancy(document.body.style, true);
    addFancy(globals.playerPageDiv.style);
}

export function addFancy(e, overflowOn) {
    e.backgroundImage = `linear-gradient(45deg, ${GM_config.get('bgColor')}, ${GM_config.get('bgEnableGradient') == true ? GM_config.get('bgGradient') : GM_config.get('bgColor')})`;
    e.animation = 'backgroundGradient 5s linear infinite alternate';
    e.backgroundSize = '150% 150%';
    e.backgroundAttachment = 'fixed';
    // e.height = '100vh';
    if(overflowOn === false) e.overflow = 'hidden';
}

export function checkDislike() {
    if(globals.dumbFix === 0) return globals.dumbFix++;
    clearTimeout(globals.skipDislikedFunction);
    globals.skipDislikedFunction = setTimeout(() => {
        if(document.getElementById('like-button-renderer').children[0].ariaPressed == 'true') document.getElementsByClassName('next-button style-scope ytmusic-player-bar')[0].click();
    }, 5000);
    globals.dumbFix = 0;
}

export function skipDisliked(turnOn) {
    const titleHolder = document.getElementsByClassName('title style-scope ytmusic-player-bar')[0];
    titleHolder.removeEventListener('DOMSubtreeModified', checkDislike, false);
    if(!turnOn) return;
    titleHolder.addEventListener('DOMSubtreeModified', checkDislike, false);
}

export function extraButtons(turnOn) {
    const playbackButtons = document.getElementsByClassName('left-controls-buttons style-scope ytmusic-player-bar')[0].children;
    if(!turnOn) {
        playbackButtons[1].hidden = true;
        playbackButtons[4].hidden = true;
    }
    else {
        playbackButtons[1].hidden = false;
        playbackButtons[4].hidden = false;
    }
}

export function fixLayout(turnOn) {
    if(turnOn) {
        globals.playerPageDiv.style.paddingTop = '0px';
        globals.mainPanel.style.marginTop = '8vh';
        globals.mainPanel.style.marginBottom = '8vh';
    }
    else {
        globals.playerPageDiv.style.padding = 'var(--ytmusic-player-page-vertical-padding) var(--ytmusic-player-page-horizontal-padding) 0';
        globals.mainPanel.style.marginTop = '0';
        globals.mainPanel.style.marginBottom = 'var(--ytmusic-player-page-vertical-padding)';
    }
}

export function removeThumbnail(turnOn) {
    globals.player.style.backgroundColor = '#01010101';
    const songImage = document.getElementById('song-image');
    setTimeout(() => {
        if(!turnOn) songImage.style.opacity = 1;
        else songImage.style.opacity = 0.001;
    }, 500);
}

export function averageOfArray(numbers) {
    let result = 0;
    for(let i = 0; i < numbers.length; i++) result += numbers[i];
    return result / numbers.length;
}

export function injectStyle(css) {
    const node = document.createElement('style');
    const textNode = document.createTextNode(css);
    node.appendChild(textNode);
    document.head.appendChild(node);
}