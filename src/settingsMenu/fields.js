import { fieldTexts } from './fieldTexts';

export let langOption = GM_getValue('ytmPlusCfg', 'english');
if(langOption != 'english') {
    langOption = JSON.parse(langOption).language;
    if(!langOption) langOption = 'english';
    else langOption = langOption.charAt(0).toLowerCase() + langOption.slice(1);
}

export function fixupFields() {
    for(const field in configFields) {
        if(fieldTexts[field] === undefined) throw new Error(`"${field}" is undefined in fieldTexts.`);
        const newLabel = { label: fieldTexts[field][langOption] || fieldTexts[field]['english'] };
        if(configFields[field].refresh === true) {
            newLabel.label += '↻';
            newLabel.title = fieldTexts.refreshTitle[langOption] || fieldTexts.refreshTitle['english'];
        }
        configFields[field] = Object.assign(newLabel, configFields[field]);

        if(configFields[field].section === undefined) continue;

        configFields[field].section = configFields[field].section[langOption] || configFields[field].section['english'];
    }
    return configFields;
}

// type: 'color' just results in a text input, they are later converted to actual color input, see open event
export const configFields = {
    changeShortcut: {
        section: fieldTexts.utilities,
        type: 'customButton',
        valueStorage: 'shortcut'
    },
    language: {
        refresh: true,
        type: 'select',
        options: ['English', 'Hungarian'],
        default: 'English'
    },
    neverAfk: {
        type: 'checkbox',
        default: true
    },
    noPromotions: {
        type: 'checkbox',
        default: true
    },
    skipDisliked: {
        type: 'checkbox',
        default: false
    },
    fixLayout: {
        type: 'checkbox',
        default: true
    },
    extraPlaybackButtons: {
        type: 'checkbox',
        default: true
    },
    videoSongSwitcher: {
        type: 'checkbox',
        default: true
    },
    removeAlbumCover: {
        type: 'checkbox',
        default: false
    },
    swapMainPanelWithPlaylist: {
        type: 'checkbox',
        default: false
    },
    navbarBackgroundChange: {
        section: fieldTexts.themeSection,
        type: 'checkbox',
        default: false
    },
    navbarBackgroundColor: {
        type: 'color',
        default: '#aa0000',
        subCheckbox: 'navbarBackgroundChange'
    },
    navbarBackgroundGradientEnabled: {
        type: 'checkbox',
        default: true,
        subCheckbox: 'navbarBackgroundChange'
    },
    navbarBackgroundGradientColor: {
        type: 'color',
        default: '#0000aa',
        subCheckbox: 'navbarBackgroundChange'
    },
    navbarBackgroundGradientAngle: {
        type: 'int',
        min: -360,
        max: 360,
        default: 45,
        subCheckbox: 'navbarBackgroundChange'
    },
    navbarBackgroundGradientAnimation: {
        type: 'select',
        options: ['Disabled', 'Horizontal', 'Vertical'],
        default: 'Horizontal',
        subCheckbox: 'navbarBackgroundChange'
    },
    siteBackgroundChange: {
        type: 'checkbox',
        default: true
    },
    siteBackgroundColor: {
        type: 'color',
        default: '#AA0000',
        subCheckbox: 'siteBackgroundChange'
    },
    siteBackgroundGradientEnabled: {
        type: 'checkbox',
        default: true,
        subCheckbox: 'siteBackgroundChange'
    },
    siteBackgroundGradientColor: {
        type: 'color',
        default: '#0000AA',
        subCheckbox: 'siteBackgroundChange'
    },
    siteBackgroundGradientAngle: {
        type: 'int',
        min: -360,
        max: 360,
        default: 45,
        subCheckbox: 'siteBackgroundChange'
    },
    siteBackgroundGradientAnimation: {
        type: 'select',
        options: ['Disabled', 'Horizontal', 'Vertical'],
        default: 'Horizontal',
        subCheckbox: 'siteBackgroundChange'
    },
    // changeUpgradeButton: {
    //     type: 'select',
    //     options: ['Original', 'Remove Button', 'Digital Clock'],
    //     default: 'Digital Clock'
    // },
    removeUpgradeButton: {
        type: 'checkbox',
        default: true
    },
    // clockColor: {
    //     type: 'color',
    //     default: '#AA3333',
    //     subOption: 'changeUpgradeButton.2'
    // },
    // clockGradient: {
    //     type: 'checkbox',
    //     default: true,
    //     subOption: 'changeUpgradeButton.2'
    // },
    // clockGradientColor: {
    //     type: 'color',
    //     default: '#3333AA',
    //     subOption: 'changeUpgradeButton.2'
    // },
    // clockGradientAngle: {
    //     type: 'int',
    //     min: -360,
    //     max: 360,
    //     default: 90,
    //     subOption: 'changeUpgradeButton.2'
    // },
    // clockGradientAnimation: {
    //     type: 'select',
    //     options: ['Disabled', 'Horizontal', 'Vertical'],
    //     default: 'Horizontal',
    //     subOption: 'changeUpgradeButton.2'
    // },
    visualizerPlace: {
        section: fieldTexts.visualizerPlaceSection,
        type: 'select',
        options: ['Disabled', 'Navbar', 'Album Cover', 'Background'],
        default: 'Album Cover'
    },
    visualizerStartsFrom: {
        type: 'select',
        options: ['Left', 'Center', 'Right', 'Edges'],
        default: 'Center'
    },
    visualizerColor: {
        type: 'color',
        default: '#C800C8'
    },
    visualizerRgbEnabled: {
        type: 'checkbox',
        default: true
    },
    visualizerFade: {
        type: 'checkbox',
        default: false
    },
    visualizerFft: {
        type: 'select',
        options: ['32', '64', '128', '256', '512', '1024', '2048', '4096', '8192', '16384'],
        default: '4096',
    },
    visualizerEnergySaverType: {
        type: 'select',
        options: ['Disabled', 'Limit FPS', 'True Pause', 'Both'],
        default: 'Disabled'
    },
    visualizerCircleEnabled: {
        type: 'checkbox',
        default: true,
    },
    visualizerRotate: {
        type: 'select',
        options: ['Disabled', 'On', 'Reactive', 'Reactive (Bass)'],
        default: 'Disabled',
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerRotateDirection: {
        type: 'select',
        options: ['Clockwise', 'Counter-Clockwise'],
        default: 'Clockwise',
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerMove: {
        type: 'select',
        options: ['Inside', 'Outside', 'Both Sides'],
        default: 'Outside',
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerBassBounceEnabled: {
        type: 'checkbox',
        default: true,
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerBassBounceSmooth: {
        type: 'checkbox',
        default: true,
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerImageType: {
        type: 'select',
        options: ['Disabled', 'Thumbnail', 'Custom'],
        default: 'Thumbnail',
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerImageCustomURL: {
        type: 'textarea',
        default: 'https://imgur.com/HSTpR8R.png',
        subCheckbox: 'visualizerCircleEnabled'
    },
    attention1: {
        section: fieldTexts.attention1Section,
        type: 'hidden'
    },
    visualizerRgbRed: {
        type: 'int',
        min: 0,
        max: 255,
        default: 255
    },
    visualizerRgbGreen: {
        type: 'int',
        min: 0,
        max: 255,
        default: 255
    },
    visualizerRgbBlue: {
        type: 'int',
        min: 0,
        max: 255,
        default: 255
    },
    visualizerRgbSamples: {
        type: 'int',
        min: 1,
        max: 8192,
        default: 512
    },
    visualizerMinDecibels: {
        type: 'int',
        min: -100,
        max: 0,
        default: -85
    },
    visualizerMaxDecibels: {
        type: 'int',
        min: -100,
        max: 0,
        default: 0
    },
    visualizerSmoothing: {
        type: 'float',
        min: 0,
        max: 1,
        default: 0.75
    },
    visualizerMinHertz: {
        type: 'int',
        min: 0,
        max: 44100,
        default: 0
    },
    visualizerMaxHertz: {
        type: 'int',
        min: 1,
        max: 44100,
        default: 4000
    },
    visualizerBassBounceMinHertz: {
        type: 'float',
        min: 0,
        max: 44100,
        default: 0
    },
    visualizerBassBounceMaxHertz: {
        type: 'float',
        min: 1,
        max: 44100,
        default: 100
    },
    visualizerBassBounceDebug: {
        type: 'checkbox',
        default: false
    },
    visualizerEnergySaverFps: {
        type: 'int',
        min: 1,
        max: 144,
        default: 30,
    },
    visualizerRenderScale: {
        type: 'float',
        min: 0.01,
        max: 2,
        default: 1
    },
    lastOpenCategory: {
        section: fieldTexts.backendSection,
        type: 'hidden',
        default: -1
    },
    shortcut: {
        type: 'hidden',
        default: 'ctrl Backslash|CTRL + ű'
    },
};