import { elements } from '../../globals/elements';
import { ytmpConfig } from '../../ytmpConfig';

export function changeNavbarBackground(turnOn) {
    if(!turnOn) return elements.navBarBg.style.removeProperty('background');

    const customNavbarColor = ytmpConfig.get('navbarBackgroundColor');
    elements.navBarBg.style.background = customNavbarColor;
}

