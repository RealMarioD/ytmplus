import { configCSS } from './css';
import { configFields } from './fields';
import { closeEvent, openEvent, saveEvent } from './events';

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
