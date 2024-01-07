import { ytmpConfig } from '../ytmpConfig';

export function keydownEvent(ev) {
    if(ev.key === 'Escape') return ytmpConfig.close();
    const shortcut = ytmpConfig.get('shortcut').split('|')[0].split(' ');
    if(shortcut.indexOf('ctrl') > -1 && ev.ctrlKey === false) return;
    if(shortcut.indexOf('shift') > -1 && ev.shiftKey === false) return;
    if(shortcut.indexOf('alt') > -1 && ev.altKey === false) return;
    if(shortcut.indexOf(ev.code) < 0) return;

    if(ytmpConfig.isOpen === false) ytmpConfig.open();
    else ytmpConfig.close();
}