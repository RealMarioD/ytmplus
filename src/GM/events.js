import { globals, visualizer } from '../globals';
import { afkEnable, changeBackground, clockEnable, extraButtons, fixLayout, injectElement, promoEnable, removeThumbnail, skipDisliked, swapMainPanelWithPlaylist } from '../utils';
import { getVideo, renderFrame } from '../visualizer/init';
import { replaceImageURL } from '../visualizer/image';
import { GM_config } from './GM_config';

function stylizeConfigWindow(doc, frame) {
    doc.body.style.overflow = 'hidden';
    frame.style.width = '60vw';
    frame.style.height = 'calc((3 / 4) * 60vw)';
    // frame.style.maxHeight = '75vh';
    frame.style.display = 'block';
    frame.style.margin = 'auto';
    frame.style.inset = '0';
    frame.style.boxShadow = '20px 20px 40px rgba(10, 10, 10, 0.8)';
    frame.style.border = '';
    frame.style.borderRadius = '1.5vw';
}

const titleSVG = // viewBox="0 0 613 99"
    `<svg>
        <g style="overflow:hidden; text-anchor: middle;">
            <defs>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="glow"/>
                    <feMerge>
                    <feMergeNode in="glow"/>
                    <feMergeNode in="glow"/>
                    <feMergeNode in="glow"/>
                    </feMerge>
                </filter>
            </defs>
            <text x="50%" y="50%" dy=".35em" text-anchor="middle">YTMPlus</text>
            <a href="https://github.com/RealMarioD/ytmplus" target="_blank"><text style="filter: url(#glow);" x="50%" y="50%" dy=".35em" text-anchor="middle">YTMPlus</text></a>
        </g>
    </svg>`;

function manageUIv2(doc) {
    const wrapper = doc.getElementById('ytmPlusCfg_wrapper');

    // Get all categories and make category names into buttons
    const categorySelect = injectElement('div', 'categorySelect', wrapper, doc);
    const categories = doc.getElementsByClassName('section_header_holder');
    for(let i = 0, len = categories.length - 1; i < len; i++) categorySelect.innerHTML += `<input type="button" class="changeCategoryButton" value="${categories[i].children[0].innerHTML}">`;

    // Handle changeCategoryButtons
    const changeCategoryButton = doc.getElementsByClassName('changeCategoryButton');
    let lastOpenSetting;
    for(let i = 0; i < changeCategoryButton.length; i++) {
        changeCategoryButton[i].addEventListener('click', () => {
            GM_config.set('lastOpenCategory', i);
            for(let j = 0; j < changeCategoryButton.length; j++) changeCategoryButton[j].disabled = false;
            changeCategoryButton[i].disabled = true; // "Disable" current button for styling
            const currentSetting = doc.getElementById('ytmPlusCfg_section_' + i);
            if(lastOpenSetting) lastOpenSetting.style = 'display: none;'; // Make last open category disappear
            lastOpenSetting = currentSetting;
            currentSetting.style = 'display: block;'; // Make selected category appear
        });
    }

    const currentSettings = injectElement('div', 'currentSettings', wrapper, doc);
    categorySelect.prepend(wrapper.childNodes[0]); // Put header (title) into categorySelect
    categorySelect.append(wrapper.childNodes[wrapper.childNodes.length - 3]); // Put save/close buttons into categorySelect
    const resetDiv = doc.getElementsByClassName('reset_holder block')[0];
    categorySelect.append(resetDiv); // Put reset button into categorySelect

    for(let i = 0, len = wrapper.childNodes.length - 2; i < len; i++) { // - 2: skip categorySelect and currentSettings
        const configVars = wrapper.childNodes[0];
        configVars.style = 'display: none;'; // Set category to invisible
        configVars.removeChild(configVars.firstElementChild);
        currentSettings.appendChild(configVars); // Move category to currentSettings and await to be visible
    }
    if(GM_config.get('lastOpenCategory') !== -1) changeCategoryButton[GM_config.get('lastOpenCategory')].click();
}

export function openEvent(doc, win, frame) { // open function is mostly customizing settings UI
    stylizeConfigWindow(doc, frame);

    // Every color input we want has to be 'manually set' (GM_config's customType would come in handy but how the hell do it work)
    const colorTypeFields = [
        'bgColor',
        'bgGradient',
        'clockColor',
        'clockGradientColor',
        'visualizerColor'
    ];
    for(let i = 0; i < colorTypeFields.length; i++) doc.getElementById('ytmPlusCfg_field_' + colorTypeFields[i]).type = 'color';

    manageUIv2(doc);

    // Live change for input tags + Adding info to int/float settings
    const inputs = doc.getElementsByTagName('input');
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', () => GM_config.save());
        if(!isNaN(parseInt(inputs[i].value, 10))) {
            const fieldSettings = GM_config.fields[inputs[i].id.split('_')[2]].settings;
            inputs[i].title = `type: ${fieldSettings.type} | default: ${fieldSettings.default} | ${fieldSettings.min} . . ${fieldSettings.max}`;
        }
    }
    // Live change for select tags
    const selects = doc.getElementsByTagName('select');
    for(let i = 0; i < selects.length; i++) selects[i].addEventListener('change', () => GM_config.save());
    // Live change for textarea tags
    const textareas = doc.getElementsByTagName('textarea');
    for(let i = 0; i < textareas.length; i++) textareas[i].addEventListener('change', () => GM_config.save());

    // Header title svg
    const title = doc.getElementById('ytmPlusCfg_header');
    // eslint-disable-next-line no-undef
    title.innerHTML = titleSVG + `<span style="-webkit-text-fill-color: white; font-size: 3vh;">${vNumber}</span>`; // vNumber hacked in with metadataBuilder

    doc.addEventListener('keydown', event => {
        if(event.key == 'Escape') GM_config.close();
    });

    globals.settingsOpen = true;
}

export function closeEvent() {
    globals.settingsOpen = false;
}

export function saveEvent(oldVisPlace, newVisPlace) {
    // Updates updateable stuff on save
    changeBackground(GM_config.get('bg'));

    clockEnable(GM_config.get('clock'));

    afkEnable(GM_config.get('noAfk'));

    promoEnable(GM_config.get('noPromo'));

    skipDisliked(GM_config.get('skipDisliked'));

    extraButtons(GM_config.get('extraButtons'));

    fixLayout(GM_config.get('padding'));

    removeThumbnail(GM_config.get('removeThumbnail'));

    swapMainPanelWithPlaylist(GM_config.get('swapMainPanelWithPlaylist'));

    oldVisPlace = visualizer.place;
    newVisPlace = GM_config.get('visualizerPlace');

    if(newVisPlace !== 'Disabled') {
        if(visualizer.analyser === undefined) return getVideo(); // visualizer was surely not turned on this session, start like usual
        visualizer.getBufferData();
        visualizer.initValues();
        if(oldVisPlace === 'Disabled') requestAnimationFrame(renderFrame); // We have an analyser, visualizer was already initialized, resume
        else replaceImageURL();
    }
    else visualizer.place = 'Disabled';

    window.dispatchEvent(new Event('resize'));
}