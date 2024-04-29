// import { elements } from '../../globals/elements';
// import { functions } from '../../globals/functions';
// import { ytmpConfig } from '../../ytmpConfig';

import { elements } from '../../globals/elements';

export async function removeUpgradeButton(turnOn) {
    // if bro has premium how about we don't remove their library button
    if(elements.bigGuideItems.children.length < 4) return;

    if(!turnOn) {
        elements.bigGuideItems.lastElementChild.style.removeProperty('display');
        try { elements.miniGuideItems.lastElementChild.style.removeProperty('display'); }
        catch {}
        return;
    }

    elements.bigGuideItems.lastElementChild.style.display = 'none';

    if(!elements.miniGuideItems) {
        const guides = await document.getElementsByTagName('ytmusic-guide-section-renderer');
        if(guides.length < 3) return;
        elements.miniGuideItems = guides[2].children[2];
    }

    elements.miniGuideItems.lastElementChild.style.display = 'none';
}

// // Old code that set the upgrade button to a digital clock in navbar
// let currentTime;
// clearInterval(functions.clockFunction);
// if(mode === 'Original') {
//     elements.upgradeButton.textContent = elements.originalUpgradeText;
//     elements.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
// }
// else if(mode === 'Digital Clock') {
//     functions.clockFunction = setInterval(() => {
//         currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         elements.upgradeButton.textContent = currentTime;
//     }, 1000);
//     elements.upgradeButton.parentElement.style.margin = '0 var(--ytmusic-pivot-bar-tab-margin)';
// }
// else {
//     elements.upgradeButton.textContent = '';
//     elements.upgradeButton.parentElement.style.margin = '0px';
// }

// // Trust me this is the way
// const buttonStyle = elements.upgradeButton.style;
// if(mode === 'Digital Clock') {
//     buttonStyle.background = `linear-gradient(${ytmpConfig.get('clockGradientAngle')}deg, ${ytmpConfig.get('clockColor')} 0%, ${ytmpConfig.get('clockGradient') === true ? ytmpConfig.get('clockGradientColor') : ytmpConfig.get('clockColor')} 50%, ${ytmpConfig.get('clockColor')} 100%)`;
//     buttonStyle.backgroundSize = '200% 200%';
//     buttonStyle.backgroundClip = 'text';
//     buttonStyle.textFillColor = 'transparent';
//     buttonStyle.webkitBackgroundClip = 'text';
//     buttonStyle.webkitTextFillColor = 'transparent';
//     buttonStyle.fontSize = '50px';
//     const animation = ytmpConfig.get('clockGradientAnimation');
//     if(animation === 'Horizontal') buttonStyle.animation = 'clockGradientHorizontal 2s linear infinite normal';
//     else if(animation === 'Vertical') buttonStyle.animation = 'clockGradientVertical 2s linear infinite normal';
//     else buttonStyle.animation = '';
// }
// else {
//     buttonStyle.background = '';
//     buttonStyle.backgroundSize = '';
//     buttonStyle.backgroundClip = '';
//     buttonStyle.textFillColor = '';
//     buttonStyle.webkitBackgroundClip = '';
//     buttonStyle.webkitTextFillColor = '';
//     buttonStyle.fontSize = '20px';
// }