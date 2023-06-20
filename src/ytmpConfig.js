import settingsMenu from './css/settingsMenu.css';
import { openEvent, saveEvent } from './settingsMenu/events';
import { injectElement } from './functions/backend/injectElement';
import { fixupFields } from './settingsMenu/fieldTexts';

export const ytmpConfig = new GM_configStruct({
    id: 'ytmPlusCfg',
    title: 'ytmPlus',
    fields: fixupFields(),
    css: settingsMenu,
    events: {
        open: openEvent,
        save: saveEvent
    },
    frame: injectElement('div', 'ytmPlusCfg', document.body, undefined, 'display: flex'),
});