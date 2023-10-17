import settingsMenu from './css/settingsMenu.css';
import { injectElement } from './functions/backend/injectElement';
import { fixupFields } from './settingsMenu/fields';

export const ytmpConfig = new GM_configStruct({
    id: 'ytmPlusCfg',
    title: 'ytmPlus',
    fields: fixupFields(),
    css: settingsMenu,
    // Moved to index.js so no more circular dependecies (yay?)
    // events: {
    //     open: openEvent,
    //     save: saveEvent
    // },
    frame: injectElement('div', 'ytmPlusCfg', document.body, undefined, 'display: flex'),
});