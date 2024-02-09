import { ytmpConfig } from '../../ytmpConfig';

export function changeWindowSize(option) {
    if(option === 'small') {
        ytmpConfig.frame.style.height = '512px';
        ytmpConfig.frame.style.fontSize = '12px';
    }
    else if(option === 'medium') {
        ytmpConfig.frame.style.height = '768px';
        ytmpConfig.frame.style.fontSize = '18px';
    }
    else if(option === 'large') {
        ytmpConfig.frame.style.height = '1080px';
        ytmpConfig.frame.style.fontSize = '24px';
    }
    else {
        ytmpConfig.frame.style.removeProperty('height');
        ytmpConfig.frame.style.removeProperty('font-size');
    }
}