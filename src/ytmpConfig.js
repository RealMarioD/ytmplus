import settingsMenu from './css/settingsMenu.css';
import { configFields } from './settingsMenu/fields';
import { openEvent, saveEvent } from './settingsMenu/events';
import { injectElement } from './functions/backend/injectElement';

export const ytmpConfig = new GM_configStruct({
    id: 'ytmPlusCfg',
    title: 'ytmPlus',
    fields: configFields,
    css: settingsMenu,
    events: {
        open: openEvent,
        save: saveEvent
    },
    frame: injectElement('div', 'ytmPlusCfg', document.body, null, 'display: flex')
});