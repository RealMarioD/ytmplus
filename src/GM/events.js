import { globals } from '../globals';
import { addFancy, afkEnable, clockEnable, extraButtons, promoEnable, skipDisliked } from '../utils';
import { getVideo } from '../visualizer/init';

export function openEvent(doc, win, frame) { // open function is mostly customizing settings UI
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

    // Every color input we want has to be changed here (customType would come in handy but how the hell do it work)
    doc.getElementById('ytmPlusCfg_field_bgColor').type = 'color';
    doc.getElementById('ytmPlusCfg_field_bgGradient').type = 'color';
    doc.getElementById('ytmPlusCfg_field_clockColor').type = 'color';
    doc.getElementById('ytmPlusCfg_field_clockGradientColor').type = 'color';
    doc.getElementById('ytmPlusCfg_field_visualizerColor').type = 'color';

    // Putting the sections and settings into a scrollable div, so that the whole window won't become scrollable
    const node = doc.createElement('div');
    node.id = 'cfgHolder';
    const wrapper = doc.getElementById('ytmPlusCfg_wrapper');
    wrapper.appendChild(node);
    for(let i = 0; i <= wrapper.childNodes.length + 1; i++) node.appendChild(wrapper.childNodes[1]); // Not sure how this works, but I somehow skip the header and the buttons at the end
    wrapper.appendChild(wrapper.childNodes[1]);

    // Live change + Adding info to advanced visualizer settings
    const inputs = doc.getElementsByTagName('input');
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', () => GM_config.save());
        if(!isNaN(parseInt(inputs[i].value))) {
            const fieldSettings = GM_config.fields[inputs[i].id.split('_')[2]].settings;
            inputs[i].title = `type: ${fieldSettings.type} | default: ${fieldSettings.default} | ${fieldSettings.min} . . ${fieldSettings.max}`;
        }
    }
    const selects = doc.getElementsByTagName('select');
    for(let i = 0; i < selects.length; i++) selects[i].addEventListener('change', () => GM_config.save());

    // Header title svg
    const title = doc.getElementById('ytmPlusCfg_header');
    title.innerHTML = `
                <svg viewBox="0 0 613 99">
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
    if(GM_config.get('bg') == false) {
        document.body.style.backgroundColor = '#000000';
        document.body.style.backgroundImage = '';
        globals.playerPageDiv.style.backgroundColor = '#000000';
        globals.playerPageDiv.style.backgroundImage = '';
    }
    else {
        try {
            document.getElementsByClassName('immersive-background style-scope ytmusic-browse-response')[0].children[0].remove();
        }
        catch { }
        document.getElementsByClassName('background-gradient style-scope ytmusic-browse-response')[0].style.backgroundImage = 'none';
        addFancy(document.body.style, true);
        addFancy(globals.playerPageDiv.style);
    }

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
    if(globals.visualizer.rgb.enabled) globals.visualizer.getRGB();
    window.dispatchEvent(new Event('resize'));
}