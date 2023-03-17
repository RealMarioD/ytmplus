import { configCSS } from './css';
import { configFields } from './fields';
import { closeEvent, openEvent, saveEvent } from './events';

// 'type': 'color'; just results in a text input, they are later converted to actual color input, see open event

export const GM_config = new GM_configStruct({
    id: 'ytmPlusCfg',
    title: 'ytmPlus',
    fields: configFields,
    css: configCSS,
    events: {
        open: (doc, win, frame) => openEvent(doc, win, frame),
        close: () => closeEvent(),
        save: () => saveEvent()
    }
});
