import { globals } from './globals';

export function promoEnable(turnOn) {
    let popup;
    if(!turnOn) clearInterval(globals.noPromoFunction);
    else {
        clearInterval(globals.noPromoFunction);
        globals.noPromoFunction = setInterval(() => {
            popup = document.getElementsByTagName('ytmusic-mealbar-promo-renderer');
            if(popup.length > 0) {
                popup[0].remove();
                console.log('ytmPlus: Removed a promotion.');
            }
        }, 1000);
    }
}

export function afkEnable(turnOn) {
    if(!turnOn) clearInterval(globals.noAfkFunction);
    else {
        clearInterval(globals.noAfkFunction);
        globals.noAfkFunction = setInterval(() => {
            document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 }));
            console.log('ytmPlus: Nudged the page so user is not AFK.');
        }, 15000);
    }
}

export function clockEnable(mode) {
    let currentTime;
    if(mode == 'Original') {
        clearInterval(globals.clockFunction);
        globals.upgradeButton.textContent = globals.originalUpgradeText;
        globals.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
    }
    else if(mode == 'Digital Clock') {
        clearInterval(globals.clockFunction);
        globals.clockFunction = setInterval(() => {
            currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            globals.upgradeButton.textContent = currentTime;
        }, 1000);
        globals.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
    }
    else {
        clearInterval(globals.clockFunction);
        globals.upgradeButton.textContent = '';
        globals.upgradeButton.parentElement.style.margin = '0px';
    }
    const a = globals.upgradeButton.style;
    a.background = mode != 'Digital Clock' ? '' : `linear-gradient(to right, ${GM_config.get('clockColor')} 0%, ${GM_config.get('clockGradient') == true ? GM_config.get('clockGradientColor') : GM_config.get('clockColor')} 50%, ${GM_config.get('clockColor')} 100%`;
    a.backgroundSize = mode != 'Digital Clock' ? '' : '200% auto';
    a.backgroundClip = mode != 'Digital Clock' ? '' : 'text';
    a.textFillColor = mode != 'Digital Clock' ? '' : 'transparent';
    a.webkitBackgroundClip = mode != 'Digital Clock' ? '' : 'text';
    a.webkitTextFillColor = mode != 'Digital Clock' ? '' : 'transparent';
    a.fontSize = mode != 'Digital Clock' ? '20px' : '50px';
    a.animation = mode != 'Digital Clock' ? '' : 'clockGradient 2s linear infinite normal';
}

export function addFancy(e, overflowOn) {
    e.backgroundImage = `linear-gradient(45deg, ${GM_config.get('bgColor')}, ${GM_config.get('bgEnableGradient') == true ? GM_config.get('bgGradient') : GM_config.get('bgColor')})`;
    e.animation = 'backgroundGradient 5s linear infinite alternate';
    e.backgroundSize = '150% 150%';
    e.backgroundAttachment = 'fixed';
    // e.height = '100vh';
    if(!overflowOn) e.overflow = 'hidden';
}

export function checkDislike() {
    if(globals.dumbFix == 0) return globals.dumbFix++;
    clearTimeout(globals.skipDislikedFunction);
    globals.skipDislikedFunction = setTimeout(() => {
        if(document.getElementById('like-button-renderer').children[0].ariaPressed == 'true') document.getElementsByClassName('next-button style-scope ytmusic-player-bar')[0].click();
    }, 5000);
    globals.dumbFix = 0;
}

export function skipDisliked(turnOn) {
    const titleHolder = document.getElementsByClassName('title style-scope ytmusic-player-bar')[0];
    if(!turnOn) return titleHolder.removeEventListener('DOMSubtreeModified', checkDislike, false);
    titleHolder.removeEventListener('DOMSubtreeModified', checkDislike, false);
    titleHolder.addEventListener('DOMSubtreeModified', checkDislike, false);
}

export function extraButtons(turnOn) {
    const playbackButtons = document.getElementsByClassName('left-controls-buttons style-scope ytmusic-player-bar')[0].children;
    if(!turnOn) {
        playbackButtons[1].hidden = true;
        playbackButtons[4].hidden = true;
        return;
    }
    playbackButtons[1].hidden = false;
    playbackButtons[4].hidden = false;
}

export function averageOfArray(numbers) {
    let result = 0;
    for(let i = 0; i < numbers.length; i++) result += numbers[i];
    return result / numbers.length;
}