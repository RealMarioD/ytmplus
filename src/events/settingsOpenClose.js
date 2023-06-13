import { ytmpConfig } from '../ytmpConfig';

export function keydownEvent(ev) {
    if(ev.code !== 'Backslash' || ev.ctrlKey === false) return;

    if(ytmpConfig.isOpen === false) ytmpConfig.open();
    else ytmpConfig.close();

    console.log(ytmpConfig);
}