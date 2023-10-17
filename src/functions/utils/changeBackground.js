import { elements } from '../../globals/elements';
import { ytmpConfig } from '../../ytmpConfig';

export function changeBackground(turnOn, firstRun) {
    if(turnOn === false) {
        if(document.body.style.backgroundImage !== '') {
            document.body.style.backgroundColor = '#000000';
            document.body.style.backgroundImage = '';
            elements.playerPage.style.background = '';
        }
        return;
    }
    try {
        if(firstRun === true) document.getElementsByTagName('ytmusic-browse-response')[0].children[0].remove();
    }
    catch {}
    try {
        document.getElementsByClassName('immersive-background style-scope ytmusic-browse-response')[0].children[0].remove();
    }
    catch {}
    document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';
    const animation = ytmpConfig.get('bgGradientAnimation');
    animateBackground(document.body.style, true, animation);
    animateBackground(elements.playerPage.style, false, animation);
}

export function animateBackground(elementStyle, overflowOn, animation) {
    elementStyle.backgroundImage = `linear-gradient(${ytmpConfig.get('bgGradientAngle')}deg, ${ytmpConfig.get('bgColor')}, ${ytmpConfig.get('bgEnableGradient') === true ? ytmpConfig.get('bgGradient') : ytmpConfig.get('bgColor')})`;
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