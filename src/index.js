import { keydownEvent } from './events/settingsOpenClose';
import { setup } from './events/windowLoad';
import { changeShortcut } from './functions/utils/changeShortcut';
import { closeEvent, openEvent, saveEvent } from './settingsMenu/events';
import { configFields } from './settingsMenu/fields';
import { ytmpConfig } from './ytmpConfig';

ytmpConfig.onOpen = openEvent;
ytmpConfig.onSave = saveEvent;
ytmpConfig.onClose = closeEvent;
configFields.changeShortcut.click = changeShortcut;

ytmpConfig.getRawValue = function(settingName) {
    const field = ytmpConfig.fields[settingName];
    if(!field) throw new Error(`No field called ${settingName}`);
    if(!field.settings.rawOptions) throw new Error(`Field ${settingName} is not select input or does not have rawOptions`);
    if(!field.settings.options) throw new Error(`Field ${settingName} does not even have English options declared in fieldTexts or fixupFields failed`);
    const index = field.settings.options.indexOf(field.value);
    if(!index) throw new Error(`Options of ${settingName} does NOT have selected value (${field.value}), [${field.settings.options.toString()}]`);
    const rawValue = field.settings.rawOptions[index];
    if(!rawValue) throw new Error('Fucking fucked');
    return rawValue;
};

window.addEventListener('keydown', keydownEvent);

window.addEventListener('load', () => setTimeout(setup, 500));