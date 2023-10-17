import { keydownEvent } from './events/settingsOpenClose';
import { setup } from './events/windowLoad';
import { openEvent, saveEvent } from './settingsMenu/events';
import { ytmpConfig } from './ytmpConfig';

ytmpConfig.onOpen = openEvent;
ytmpConfig.onSave = saveEvent;

window.addEventListener('keydown', (e) => keydownEvent(e));

window.addEventListener('load', () => setup());