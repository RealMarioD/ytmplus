import { injectElement } from '../../functions/backend/injectElement';
import { ytmpConfig } from '../../ytmpConfig';

export async function sortOutCategories(wrapper) {
    const sideBySide = injectElement('div', 'sideBySide', wrapper);
    const categorySelect = injectElement('div', 'categorySelect', sideBySide);

    // Get all categories and make category names into buttons
    const categories = document.getElementsByClassName('section_header_holder');
    for(let i = 0, len = categories.length - 1; i < len; i++) categorySelect.innerHTML += `<input type="button" class="changeCategoryButton ytmPlusBorder" value="${categories[i].children[0].innerHTML}">`;

    // Set click events to each category button
    const changeCategoryButton = document.getElementsByClassName('changeCategoryButton');
    let lastOpenSetting;
    for(let i = 0; i < changeCategoryButton.length; i++) {
        changeCategoryButton[i].addEventListener('click', () => {
            for(let j = 0; j < changeCategoryButton.length; j++) changeCategoryButton[j].disabled = false; // Enable all buttons
            changeCategoryButton[i].disabled = true; // "Disable" current button (for styling)
            const currentSetting = document.getElementById('ytmPlusCfg_section_' + i); // Find matching category settings
            if(lastOpenSetting) lastOpenSetting.style.display = 'none'; // Make previously opened category disappear
            currentSetting.style.display = 'flex'; // Make selected category appear
            ytmpConfig.set('lastOpenCategory', i); // Set self as last open
            lastOpenSetting = currentSetting;
        });
    }

    injectElement('div', 'divider', sideBySide, null, 'background: #fff; width: 2px; height: 90%;');

    const currentSettings = injectElement('div', 'currentSettings', sideBySide);
    categorySelect.prepend(wrapper.childNodes[0]); // Put header (title) into categorySelect
    categorySelect.append(wrapper.childNodes[wrapper.childNodes.length - 2]); // Put save/close buttons into categorySelect
    categorySelect.lastElementChild.style.display = 'none'; // V3: remove save and close buttons, everything auto saves, close button is now X in top right

    const resetDiv = document.getElementsByClassName('reset_holder block')[0];
    categorySelect.append(resetDiv); // Put reset button into categorySelect
    resetDiv.innerHTML = '';
    // Recreate a element, easiest way to remove default listener without changing gm_config
    const resetLink = await injectElement('a', 'ytmPlusCfg_resetLink', resetDiv, 'reset');
    resetLink.innerHTML = 'Reset to defaults';

    for(let i = 0, len = wrapper.childNodes.length - 1; i < len; i++) { // - 1: skip sideBySide div i think
        const configVars = wrapper.childNodes[0];
        configVars.style = 'display: none;'; // Set category to invisible
        configVars.removeChild(configVars.firstElementChild); // Remove category name
        currentSettings.appendChild(configVars); // Move category to currentSettings and wait to be visible
    }
    if(ytmpConfig.get('lastOpenCategory') !== -1) changeCategoryButton[ytmpConfig.get('lastOpenCategory')].click();

    return resetLink;
}