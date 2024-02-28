import { fieldTexts } from './fieldTexts';

export function fixupFields() {
    // When we first call this function, ytmpConfig is not initalized yet, so we can't use ytmpConfig.get('language'), yadi yadi yada
    // also circular dependecies are apparently a bad thing...
    let langOption = 'english';
    const rawSaveData = GM_getValue('ytmPlusCfg', undefined);
    if(rawSaveData !== undefined) {
        const parsedSaveData = JSON.parse(rawSaveData);
        if(parsedSaveData !== undefined && parsedSaveData.language !== undefined) langOption = parsedSaveData.language.toLowerCase();
    }

    for(const field in configFields) {
        if(fieldTexts[field] === undefined) {
            console.warn(`"${field}" is undefined in fieldTexts! Only do this for hidden fields!`);
            continue;
        }

        if(configFields[field].type === 'customSelect') {
            if(configFields[field].rawOptions !== undefined) {
                if(fieldTexts[field].options === undefined) throw new Error(`"${field}" is missing options in fieldTexts!`);
                configFields[field].options = fieldTexts[field].options[langOption] || fieldTexts[field].options['english'];
                configFields[field].value = configFields[field].options[configFields[field].rawOptions.indexOf(configFields[field].default)];
            }
            else throw new Error(`"${field}" is missing rawOptions!`);
        }

        if(configFields[field].label === undefined) {
            const newLabel = { label: fieldTexts[field][langOption] || fieldTexts[field]['english'] };
            configFields[field] = Object.assign(newLabel, configFields[field]); // We merge so label is the first property, if label is not the first property, label/input order will be messed up
        }
        else configFields[field].label = fieldTexts[field][langOption] || fieldTexts[field]['english'];

        if(configFields[field].refresh === true) {
            configFields[field].label += '↻';
            configFields[field].title = fieldTexts.refreshTitle[langOption] || fieldTexts.refreshTitle['english'];
        }

        if(configFields[field].section !== undefined) configFields[field].section = configFields[field].section[langOption] || configFields[field].section['english'];
    }
    return configFields;
}

// type: 'color' just results in a text input, they are later converted to actual color input, see open event
export const configFields = {
    changeShortcut: {
        section: fieldTexts.ytmpSettings,
        type: 'customButton',
        valueStorage: 'shortcut'
    },
    language: {
        refresh: true,
        type: 'customSelect',
        rawOptions: ['English', 'Hungarian'],
        default: 'English'
    },
    changeWindowSize: {
        type: 'customSelect',
        rawOptions: ['auto', 'small', 'medium', 'large'],
        default: 'auto'
    },
    neverAfk: {
        section: fieldTexts.utilities,
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
    unlockWidth: {
        type: 'customSelect',
        rawOptions: ['Disabled', 'Album Cover', 'Playlist', 'Both'],
        default: 'Album Cover'
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
        type: 'customSelect',
        rawOptions: ['Disabled', 'Horizontal', 'Vertical'],
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
        type: 'customSelect',
        rawOptions: ['Disabled', 'Horizontal', 'Vertical'],
        default: 'Horizontal',
        subCheckbox: 'siteBackgroundChange'
    },
    // changeUpgradeButton: {
    //     type: 'customSelect',
    //     rawOptions: ['Original', 'Remove Button', 'Digital Clock'],
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
    //     type: 'customSelect',
    //     rawOptions: ['Disabled', 'Horizontal', 'Vertical'],
    //     default: 'Horizontal',
    //     subOption: 'changeUpgradeButton.2'
    // },
    visualizerPlace: {
        section: fieldTexts.visualizerPlaceSection,
        type: 'customSelect',
        rawOptions: ['Disabled', 'Navbar', 'Album Cover', 'Background'],
        default: 'Album Cover'
    },
    visualizerStartsFrom: {
        type: 'customSelect',
        rawOptions: ['Left', 'Center', 'Right', 'Edges'],
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
        type: 'customSelect',
        rawOptions: ['32', '64', '128', '256', '512', '1024', '2048', '4096', '8192', '16384'],
        default: '4096',
    },
    visualizerEnergySaverType: {
        type: 'customSelect',
        rawOptions: ['Disabled', 'Limit FPS', 'True Pause', 'Both'],
        default: 'Disabled'
    },
    visualizerCircleEnabled: {
        type: 'checkbox',
        default: true,
    },
    visualizerRotate: {
        type: 'customSelect',
        rawOptions: ['Disabled', 'On', 'Reactive', 'Reactive (Bass)'],
        default: 'Disabled',
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerRotateDirection: {
        type: 'customSelect',
        rawOptions: ['Clockwise', 'Counter-Clockwise'],
        default: 'Clockwise',
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerMove: {
        type: 'customSelect',
        rawOptions: ['Inside', 'Outside', 'Both Sides'],
        default: 'Outside',
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerShakeEnabled: {
        type: 'checkbox',
        default: true,
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
        type: 'customSelect',
        rawOptions: ['Disabled', 'Thumbnail', 'Custom'],
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
    visualizerBassBounceThreshold: {
        type: 'float',
        min: 0,
        max: 1,
        default: 0.45
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
    visualizerShakeThreshold: {
        type: 'float',
        min: 0,
        max: 1,
        default: 0.45
    },
    visualizerShakeMultiplier: {
        type: 'float',
        min: 1,
        max: 100,
        default: 10
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
    windowSize: {
        type: 'int',
        min: 0,
        max: 3,
        default: 0
    }
};