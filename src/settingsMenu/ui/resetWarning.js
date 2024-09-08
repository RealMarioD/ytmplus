import { injectElement } from '../../functions/backend/injectElement';
import { ytmpConfig } from '../../ytmpConfig';

export async function createResetWarning(frame, resetLink) {
    // Creating window that pops up if you press reset
    const resetWarning = await injectElement('div', 'reset_warning', frame, undefined, 'display: none');
    const warningText = await injectElement('span', 'warning_text', resetWarning);
    warningText.innerText = 'WAIT!\nRESET EVERYTHING TO DEFAULT?';
    const buttonHolder = await injectElement('div', 'warning_button_holder', resetWarning);
    const yesResetButton = await injectElement('input', 'yes_reset_button', buttonHolder, 'warning_buttons');
    yesResetButton.type = 'button';
    yesResetButton.value = 'Yes, reset';
    yesResetButton.addEventListener('click', () => {
        ytmpConfig.reset();
        ytmpConfig.save();
        resetWarning.style.display = 'none';
    });
    const noGoBackButton = await injectElement('input', 'no_goback_button', buttonHolder, 'warning_buttons');
    noGoBackButton.type = 'button';
    noGoBackButton.value = 'No, go back';
    noGoBackButton.addEventListener('click', () => {
        resetWarning.style.display = 'none';
    });

    resetLink.addEventListener('click', () => {
        resetWarning.style.display = 'flex';
    });
}