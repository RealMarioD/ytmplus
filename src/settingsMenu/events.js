import { startVisualizer } from '../functions/visualizer/init';
import { ytmpConfig } from '../ytmpConfig';
import { manageUI } from './ui/init';
import { configFields } from './fields';
import { setupAutosave } from './ui/autosave';
import { fixPlacement } from './ui/movement';
import { toCallOnEvents } from '../events/toCallOnEvents';
import { changeWindowSize } from '../functions/utils/changeWindowSize';

export function openEvent(doc, win, frame) { // open function is mostly customizing settings UI
    // Quick hack for color fields
    for(const key in configFields) {
        if(configFields[key].type !== 'color') continue;
        document.getElementById(`ytmPlusCfg_field_${key}`).type = 'color';
        if(key === 'changeShortcut') configFields[key].label += ytmpConfig.get('shortcut').split('|')[1];
        ytmpConfig.fields[key].node.selectIndex = ytmpConfig.get(key);
    }

    console.log(ytmpConfig);

    manageUI(frame);

    setupAutosave();

    // gmconfig probably does frame.style = {} onOpen or some other fuckery, so we say fuck you and reapply
    changeWindowSize(ytmpConfig.get('changeWindowSize'));
    // surely there is a better way to do this, but this is seems better than the better way, i better be right xdx im so funny

    setTimeout(() => {
        ytmpConfig.frame.style.transition = '0.1s';
        fixPlacement(frame);
    }, 100);
}

export function closeEvent() {
    ytmpConfig.frame.style.transition = '0s';
}

export function saveEvent() {
    // Updates updateable stuff on save
    for(const fn in toCallOnEvents) toCallOnEvents[fn](ytmpConfig.get(fn));

    startVisualizer();

    window.dispatchEvent(new Event('resize'));
}