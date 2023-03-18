import { globals } from '../globals';
import { afkEnable, changeBackground, clockEnable, extraButtons, promoEnable, skipDisliked } from '../utils';
import { getVideo } from '../visualizer/init';
import { GM_config } from './GM_config';

function stylizeConfigWindow(doc, frame) {
    doc.body.style.overflow = 'hidden';
    frame.style.width = '25vw';
    // frame.style.height = // '80vh';
    frame.style.maxHeight = '85vh';
    frame.style.display = 'block';
    frame.style.margin = 'auto';
    frame.style.inset = '0';
    frame.style.boxShadow = '20px 20px 40px rgba(10, 10, 10, 0.8)';
    frame.style.border = '';
    frame.style.borderRadius = '1.5vw';
}

function stylizeConfigButtons(doc) {
    const buttons = doc.getElementById('ytmPlusCfg_buttons_holder');
    buttons.style.textAlign = 'center';
    for(let i = 0; i < buttons.children.length; i++) {
        const e = buttons.children[i];
        if(i + 1 != buttons.children.length) {
            e.style.verticalAlign = 'middle';
            e.style.backgroundColor = 'rgba(66, 66, 66, 0.8)';
            e.style.fontSize = '2vh';
        }
        else e.firstChild.style.fontSize = '2vh';
        e.style.margin = '0.5vh';
    }
}

const titleSVG =
    `<svg viewBox="0 0 613 99">
        <g style="overflow:hidden; text-anchor: middle;">
            <defs>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="10" result="glow"/>
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

export function openEvent(doc, win, frame) { // open function is mostly customizing settings UI
    stylizeConfigWindow(doc, frame);
    stylizeConfigButtons(doc);

    // Every color input we want has to be 'manually set' (GM_config's customType would come in handy but how the hell do it work)
    const colorTypeFields = [
        'bgColor',
        'bgGradient',
        'clockColor',
        'clockGradientColor',
        'visualizerColor'
    ];
    for(let i = 0; i < colorTypeFields.length; i++) doc.getElementById('ytmPlusCfg_field_' + colorTypeFields[i]).type = 'color';

    // Putting the sections and settings into a scrollable div, so that the whole window won't become scrollable
    const node = doc.createElement('div');
    node.id = 'cfgHolder';
    const wrapper = doc.getElementById('ytmPlusCfg_wrapper');
    wrapper.appendChild(node);
    for(let i = 0; i <= wrapper.childNodes.length + 1; i++) node.appendChild(wrapper.childNodes[1]); // Not sure how this works, but I somehow skip the header and the buttons at the end
    wrapper.appendChild(wrapper.childNodes[1]);

    // Live change for input tags + Adding info to int/float settings
    const inputs = doc.getElementsByTagName('input');
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', () => GM_config.save());
        if(!isNaN(parseInt(inputs[i].value))) {
            const fieldSettings = GM_config.fields[inputs[i].id.split('_')[2]].settings;
            inputs[i].title = `type: ${fieldSettings.type} | default: ${fieldSettings.default} | ${fieldSettings.min} . . ${fieldSettings.max}`;
        }
    }
    // Live change for select tags
    const selects = doc.getElementsByTagName('select');
    for(let i = 0; i < selects.length; i++) selects[i].addEventListener('change', () => GM_config.save());

    // Header title svg
    const title = doc.getElementById('ytmPlusCfg_header');
    title.innerHTML = titleSVG;

    // Handles opening/closing categories
    const categories = doc.getElementsByClassName('section_header_holder');
    for(let i = 0; i < categories.length; i++) {
        categories[i].style.overflowY = 'hidden';
        if(GM_config.get(`section${i}`) == 'open') {
            categories[i].children[0].innerHTML = '▲ ' + categories[i].children[0].innerHTML + ' ▲';
            categories[i].style.height = 'auto';
        }
        else if(GM_config.get(`section${i}`) == 'closed') {
            categories[i].children[0].innerHTML = '▼ ' + categories[i].children[0].innerHTML + ' ▼';
            categories[i].style.height = '3.25vh';
        }


        categories[i].children[0].addEventListener('click', () => {
            if(GM_config.get(`section${i}`) == 'closed') {
                categories[i].style.height = 'auto';
                categories[i].children[0].innerHTML = categories[i].children[0].innerHTML.replaceAll(/▼/g, '▲');
                GM_config.set(`section${i}`, 'open');
                GM_config.save();
            }
            else if(GM_config.get(`section${i}`) == 'open') {
                categories[i].style.height = '3.25vh';
                categories[i].children[0].innerHTML = categories[i].children[0].innerHTML.replaceAll(/▲/g, '▼');
                GM_config.set(`section${i}`, 'closed');
                GM_config.save();
            }
        });
    }

    doc.addEventListener('keydown', event => {
        if(event.key == 'Escape') GM_config.close();
    });

    globals.settingsOpen = true;
}

export function closeEvent() {
    globals.settingsOpen = false;
}

export function saveEvent() {
    // Updates updateable stuff on save
    changeBackground(GM_config.get('bg'));

    clockEnable(GM_config.get('clock'));

    afkEnable(GM_config.get('noAfk'));

    promoEnable(GM_config.get('noPromo'));

    skipDisliked(GM_config.get('skipDisliked'));

    extraButtons(GM_config.get('extraButtons'));

    if(GM_config.get('visualizerPlace') != 'Disabled') {
        if(globals.visualizer.analyser === undefined) getVideo();
        else {
            globals.visualizer.initValues();
            globals.visualizer.getBufferData();
        }
    }
    else globals.visualizer.place = 'Disabled';

    window.dispatchEvent(new Event('resize'));
}