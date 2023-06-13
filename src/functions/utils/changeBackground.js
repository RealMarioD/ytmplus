import { elements } from '../../globals/elements';
import { ytmpConfig } from '../../ytmpConfig';

export function changeBackground(turnOn, firstRun) {
    if(turnOn === false) {
        if(document.body.style.backgroundImage !== '') {
            document.body.style.backgroundColor = '#000000';
            document.body.style.backgroundImage = '';
            elements.playerPageDiv.style.backgroundColor = '#000000';
            elements.playerPageDiv.style.backgroundImage = '';
        }
        return;
    }
    try {
        if(firstRun === true) document.getElementsByTagName('ytmusic-browse-response')[0].children[0].remove();
        document.getElementsByClassName('immersive-background style-scope ytmusic-browse-response')[0].children[0].remove();
    }
    catch { }
    document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';
    const animation = ytmpConfig.get('bgGradientAnimation');
    animateBackground(document.body.style, true, animation);
    animateBackground(elements.playerPageDiv.style, false, animation);
}

export function animateBackground(element, overflowOn, animation) {
    element.backgroundImage = `linear-gradient(${ytmpConfig.get('bgGradientAngle')}deg, ${ytmpConfig.get('bgColor')}, ${ytmpConfig.get('bgEnableGradient') == true ? ytmpConfig.get('bgGradient') : ytmpConfig.get('bgColor')})`;
    element.backgroundAttachment = 'fixed';

    if(animation !== 'Disabled') {
        element.backgroundSize = '200% 200%';
        element.animation = `backgroundGradient${animation} 5s linear infinite alternate`;
    }
    else {
        element.backgroundSize = '100% 100%';
        element.animation = '';
        element.backgroundPosition = 'center center';
    }

    if(overflowOn === false) element.overflow = 'hidden';
}