import { keydownEvent } from './events/settingsOpenClose';
import { setup } from './events/windowLoad';
import { changeShortcut } from './functions/utils/changeShortcut';
import { openEvent, saveEvent } from './settingsMenu/events';
import { configFields } from './settingsMenu/fields';
import { ytmpConfig } from './ytmpConfig';

ytmpConfig.onOpen = openEvent;
ytmpConfig.onSave = saveEvent;
configFields.changeShortcut.click = changeShortcut;

window.addEventListener('keydown', keydownEvent);

window.addEventListener('load', () => setTimeout(setup, 500));