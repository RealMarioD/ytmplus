import { elements } from '../../globals/elements';
import { ytmpConfig } from '../../ytmpConfig';

export function siteBackgroundChange(turnOn) {
    if(turnOn === false) {
        if(document.body.style.backgroundImage !== '') {
            document.body.style.backgroundColor = '#000000';
            document.body.style.backgroundImage = '';
            elements.playerPage.style.background = '';
        }
        return;
    }

    document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';
    const animation = ytmpConfig.get('siteBackgroundGradientAnimation');
    animateBackground(document.body.style, true, animation);
    animateBackground(elements.playerPage.style, false, animation);

    const browsePages = document.getElementsByTagName('ytmusic-browse-response');
    if(browsePages.length === 0) return console.error('BackgroundError: No browsePage');
    if(browsePages[0].children.length === 0) return console.error('BackgroundError: No browsePage children');
    const maybeBackground = browsePages[0].children[0];
    if(maybeBackground.id === 'background') maybeBackground.remove();
}

export function animateBackground(elementStyle, overflowOn, animation) {
    elementStyle.backgroundImage = `linear-gradient(${ytmpConfig.get('siteBackgroundGradientAngle')}deg, ${ytmpConfig.get('siteBackgroundColor')}, ${ytmpConfig.get('siteBackgroundGradientEnabled') === true ? ytmpConfig.get('siteBackgroundGradientColor') : ytmpConfig.get('siteBackgroundColor')})`;
    elementStyle.backgroundAttachment = 'fixed';

    if(animation !== 'Disabled') {
        elementStyle.backgroundSize = '200% 200%';
        elementStyle.animation = `backgroundGradient${animation} 5s linear infinite alternate`;
    }
    else {
        elementStyle.backgroundSize = '100% 100%';
        elementStyle.animation = '';
        elementStyle.backgroundPosition = 'center center';
    }

    // if(overflowOn === false) elementStyle.overflow = 'hidden';
}