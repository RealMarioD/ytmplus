import { logplus } from './debug';
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
            logplus('Removed a promotion.');
        }
    }, 1000);
}

export function afkEnable(turnOn) { // Credit to q1k - https://greasyfork.org/en/users/1262-q1k
    clearInterval(globals.noAfkFunction);
    if(!turnOn) return;
    globals.noAfkFunction = setInterval(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 }));
        logplus('Nudged the page so user is not AFK.');
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

    // Trust me this is the way
    const buttonStyle = globals.upgradeButton.style;
    if(mode === 'Digital Clock') {
        buttonStyle.background = `linear-gradient(${GM_config.get('clockGradientAngle')}deg, ${GM_config.get('clockColor')} 0%, ${GM_config.get('clockGradient') === true ? GM_config.get('clockGradientColor') : GM_config.get('clockColor')} 50%, ${GM_config.get('clockColor')} 100%)`;
        buttonStyle.backgroundSize = '200% 200%';
        buttonStyle.backgroundClip = 'text';
        buttonStyle.textFillColor = 'transparent';
        buttonStyle.webkitBackgroundClip = 'text';
        buttonStyle.webkitTextFillColor = 'transparent';
        buttonStyle.fontSize = '50px';
        const animation = GM_config.get('clockGradientAnimation');
        if(animation === 'Horizontal') buttonStyle.animation = 'clockGradientHorizontal 2s linear infinite normal';
        else if(animation === 'Vertical') buttonStyle.animation = 'clockGradientVertical 2s linear infinite normal';
        else buttonStyle.animation = '';
    }
    else {
        buttonStyle.background = '';
        buttonStyle.backgroundSize = '';
        buttonStyle.backgroundClip = '';
        buttonStyle.textFillColor = '';
        buttonStyle.webkitBackgroundClip = '';
        buttonStyle.webkitTextFillColor = '';
        buttonStyle.fontSize = '20px';
    }
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
    const animation = GM_config.get('bgGradientAnimation');
    addFancy(document.body.style, true, animation);
    addFancy(globals.playerPageDiv.style, false, animation);
}

export function addFancy(e, overflowOn, animation) {
    e.backgroundImage = `linear-gradient(${GM_config.get('bgGradientAngle')}deg, ${GM_config.get('bgColor')}, ${GM_config.get('bgEnableGradient') == true ? GM_config.get('bgGradient') : GM_config.get('bgColor')})`;
    if(animation === 'Horizontal') {
        e.backgroundSize = '200% 200%';
        e.animation = 'backgroundGradientHorizontal 5s linear infinite alternate';
    }
    else if(animation === 'Vertical') {
        e.backgroundSize = '200% 200%';
        e.animation = 'backgroundGradientVertical 5s linear infinite alternate';
    }
    else {
        e.backgroundSize = '100% 100%';
        e.animation = '';
        e.backgroundPosition = 'center center';
    }
    e.backgroundAttachment = 'fixed';
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

export async function swapMainPanelWithPlaylist(turnOn) {
    if(turnOn) {
        if(globals.mainPanel.parentNode.lastElementChild.id === globals.mainPanel.id) return;
        await globals.mainPanel.parentNode.append(globals.mainPanel);
        globals.mainPanel.style.flexDirection = 'row-reverse';
        globals.mainPanel.parentNode.children[1].style.margin = '0 var(--ytmusic-player-page-content-gap) 0 0';
    }
    else {
        if(globals.mainPanel.parentNode.firstElementChild.id === globals.mainPanel.id) return;
        await globals.mainPanel.parentNode.prepend(globals.mainPanel);
        globals.mainPanel.style.flexDirection = 'row';
        globals.mainPanel.parentNode.lastElementChild.style.margin = '0 0 0 var(--ytmusic-player-page-content-gap)';
    }
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