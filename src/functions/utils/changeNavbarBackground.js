import { elements } from '../../globals/elements';
import { ytmpConfig } from '../../ytmpConfig';

export function changeNavbarBackground(turnOn) {
    if(!turnOn) return elements.navBarBg.style.removeProperty('background-image');

    elements.navBarBg.style.backgroundImage = `linear-gradient(${ytmpConfig.get('navbarGradientAngle')}deg, ${ytmpConfig.get('navbarBackgroundColor')}, ${ytmpConfig.get('navbarEnableGradient') == true ? ytmpConfig.get('navbarGradient') : ytmpConfig.get('navbarBackgroundColor')})`;
    elements.navBarBg.style.backgroundAttachment = 'fixed';
}

