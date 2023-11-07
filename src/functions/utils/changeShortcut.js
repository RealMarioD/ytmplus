import { keydownEvent } from '../../events/settingsOpenClose';
import { ytmpConfig } from '../../ytmpConfig';
import { injectElement } from '../backend/injectElement';

export function changeShortcut() {
    // Create overlay window
    window.removeEventListener('keydown', keydownEvent);
    const shortcutWindow = injectElement('div', 'shortcutWindow', document.body);
    const shortcutText = injectElement('div', 'shortcutText', shortcutWindow);
    const prompt = 'Press the buttons you would like to use,\nor press Escape to close this window.';
    shortcutText.innerText = prompt;
    const buttonHolder = injectElement('div', 'shortcutButtonHolder', shortcutWindow);
    const saveButton = injectElement('input', 'saveShortcut', buttonHolder);
    saveButton.type = 'button';
    saveButton.value = 'Save';
    saveButton.addEventListener('click', saveShortcut);
    const resetButton = injectElement('input', 'resetShortcut', buttonHolder);
    resetButton.type = 'button';
    resetButton.value = 'Reset';
    resetButton.addEventListener('click', resetShortcut);

    let lastPressedKey, fancyKey;
    window.addEventListener('keydown', handleKeystrokes);

    function handleKeystrokes(e) {
        if(e.key === 'Escape') {
            window.removeEventListener('keydown', handleKeystrokes);
            window.addEventListener('keydown', keydownEvent);
            return shortcutWindow.remove();
        }

        if((e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt') === false) lastPressedKey = e;
        else return;
        fancyKey = (e.ctrlKey ? 'CTRL + ' : '') + (e.shiftKey ? 'SHIFT + ' : '') + (e.altKey ? 'ALT + ' : '') + e.key;
        shortcutText.innerText = fancyKey;
    }
    function saveShortcut() {
        if(!lastPressedKey) {
            shortcutText.animate({
                marginLeft: ['0', '2%', '-2%', '0'],
                color: ['red', 'white'],
                easing: 'linear'
            }, 250);
            return;
        }
        const shortcutValue = (lastPressedKey.ctrlKey ? 'ctrl ' : '') +
                    (lastPressedKey.shiftKey ? 'shift ' : '') +
                    (lastPressedKey.altKey ? 'alt ' : '') +
                    (lastPressedKey.code ? lastPressedKey.code : '') +
                    '|' + fancyKey;
        ytmpConfig.set('shortcut', shortcutValue);
        ytmpConfig.save();
        shortcutText.innerText = 'Saved!\nPress Escape to close this window.';
    }
    function resetShortcut() {
        lastPressedKey = undefined;
        shortcutText.innerText = prompt;
    }
}