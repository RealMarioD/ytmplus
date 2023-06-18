import { ytmpConfig } from '../../ytmpConfig';

export function setupAutosave() {
    // Autosave for input tags + Adding info to int/float settings
    const inputs = document.getElementsByTagName('input');
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', () => ytmpConfig.save());
        if(!isNaN(parseInt(inputs[i].value, 10))) {
            const fieldSettings = ytmpConfig.fields[inputs[i].id.split('_')[2]].settings;
            inputs[i].title = `type: ${fieldSettings.type} | default: ${fieldSettings.default} | ${fieldSettings.min} . . ${fieldSettings.max}`;
        }
    }
    // Autosave for select tags
    const selects = document.getElementsByTagName('select');
    for(let i = 0; i < selects.length; i++) selects[i].addEventListener('change', () => ytmpConfig.save());

    // Autosave for textarea tags + adjustments for full width
    const textareas = document.getElementsByTagName('textarea');
    for(let i = 0; i < textareas.length; i++) {
        textareas[i].parentElement.style.alignItems = 'stretch';
        textareas[i].previousSibling.style.padding = 0;
        textareas[i].addEventListener('change', () => ytmpConfig.save());
    }
}