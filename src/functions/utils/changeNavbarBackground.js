import { elements } from '../../globals/elements';
import { ytmpConfig } from '../../ytmpConfig';

export function changeNavbarBackground(turnOn) {
    if(!turnOn) return elements.navBarBg.style.removeProperty('background-image');

    elements.navBarBg.style.backgroundImage = `linear-gradient(${ytmpConfig.get('navbarGradientAngle')}deg, ${ytmpConfig.get('navbarBackgroundColor')}, ${ytmpConfig.get('navbarEnableGradient') == true ? ytmpConfig.get('navbarGradient') : ytmpConfig.get('navbarBackgroundColor')})`;
    elements.navBarBg.style.backgroundAttachment = 'fixed';

    animateNavbar(elements.navBarBg.style, null, ytmpConfig.get('navbarGradientAnimation'));
}


function animateNavbar(elementStyle, overflowOn, animation) {
    if(animation !== 'Disabled') {
        elementStyle.backgroundSize = '200% 200%';
        elements.navBarBg.style.backgroundImage = `linear-gradient(${ytmpConfig.get('navbarGradientAngle')}deg, ${ytmpConfig.get('navbarBackgroundColor')}, ${ytmpConfig.get('navbarEnableGradient') == true ? ytmpConfig.get('navbarGradient') : ytmpConfig.get('navbarBackgroundColor')})`;
        elements.navBarBg.style.backgroundAttachment = 'fixed';
        elementStyle.animation = `backgroundGradient${animation} 5s linear infinite alternate`;
    }
    else {
        elementStyle.backgroundSize = '100% 100%';
        elementStyle.animation = '';
        elementStyle.backgroundPosition = 'center center';
    }

    // if(overflowOn === false) elementStyle.overflow = 'hidden';
}