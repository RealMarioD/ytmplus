import { fieldTexts } from './fieldTexts';

export let langOption = GM_getValue('ytmPlusCfg', 'english');
if(langOption != 'english') {
    langOption = JSON.parse(langOption).language;
    if(!langOption) langOption = 'english';
    else langOption = langOption.charAt(0).toLowerCase() + langOption.slice(1);
}

// 'type': 'color'; just results in a text input, they are later converted to actual color input, see open event
export const configFields = {
    language: {
        label: fieldTexts.lang[langOption],
        section: fieldTexts.langSection[langOption],
        type: 'select',
        options: ['English', 'Hungarian'],
        default: 'English'
    },
    neverAfk: {
        label: fieldTexts.noAfk[langOption],
        type: 'checkbox',
        default: true
    },
    noPromotions: {
        label: fieldTexts.noPromo[langOption],
        type: 'checkbox',
        default: true
    },
    skipDisliked: {
        label: fieldTexts.skipDisliked[langOption],
        type: 'checkbox',
        default: false
    },
    fixLayout: {
        label: fieldTexts.padding[langOption],
        type: 'checkbox',
        default: true
    },
    extraPlaybackButtons: {
        label: fieldTexts.extraButtons[langOption],
        type: 'checkbox',
        default: true
    },
    removeAlbumCover: {
        label: fieldTexts.removeThumbnail[langOption],
        type: 'checkbox',
        default: false
    },
    swapMainPanelWithPlaylist: {
        label: fieldTexts.swapMainPanelWithPlaylist[langOption],
        type: 'checkbox',
        default: false
    },
    changeNavbarBackground: {
        label: fieldTexts.changeNavbarBackground[langOption],
        section: fieldTexts.themeSection[langOption],
        type: 'checkbox',
        default: false
    },
    navbarBackgroundColor: {
        label: fieldTexts.navbarBackgroundColor[langOption],
        type: 'color',
        default: '#030303',
        subCheckbox: 'changeNavbarBackground'
    },
    changeBackground: {
        label: fieldTexts.changeBackground[langOption],
        type: 'checkbox',
        default: true
    },
    bgColor: {
        label: fieldTexts.bgColor[langOption],
        type: 'color',
        default: '#AA0000',
        subCheckbox: 'changeBackground'
    },
    bgEnableGradient: {
        label: fieldTexts.bgEnableGradient[langOption],
        type: 'checkbox',
        default: true
    },
    bgGradient: {
        label: fieldTexts.bgGradient[langOption],
        type: 'color',
        default: '#0000AA',
        subCheckbox: 'bgEnableGradient'
    },
    bgGradientAngle: {
        label: fieldTexts.bgGradientAngle[langOption],
        type: 'int',
        min: -360,
        max: 360,
        default: 45,
        subCheckbox: 'bgEnableGradient'
    },
    bgGradientAnimation: {
        label: fieldTexts.bgGradientAnimation[langOption],
        type: 'select',
        options: ['Disabled', 'Horizontal', 'Vertical'],
        default: 'Horizontal',
        subCheckbox: 'bgEnableGradient'
    },
    changeUpgradeButton: {
        label: fieldTexts.clock[langOption],
        type: 'select',
        options: ['Original', 'Remove Button', 'Digital Clock'],
        default: 'Digital Clock'
    },
    clockColor: {
        label: fieldTexts.clockColor[langOption],
        type: 'color',
        default: '#AA3333',
        subOption: 'changeUpgradeButton.2'
    },
    clockGradient: {
        label: fieldTexts.clockGradient[langOption],
        type: 'checkbox',
        default: true,
        subOption: 'changeUpgradeButton.2'
    },
    clockGradientColor: {
        label: fieldTexts.clockGradientColor[langOption],
        type: 'color',
        default: '#3333AA',
        subOption: 'changeUpgradeButton.2'
    },
    clockGradientAngle: {
        label: fieldTexts.clockGradientAngle[langOption],
        type: 'int',
        min: -360,
        max: 360,
        default: 90,
        subOption: 'changeUpgradeButton.2'
    },
    clockGradientAnimation: {
        label: fieldTexts.clockGradientAnimation[langOption],
        type: 'select',
        options: ['Disabled', 'Horizontal', 'Vertical'],
        default: 'Horizontal',
        subOption: 'changeUpgradeButton.2'
    },
    visualizerPlace: {
        label: fieldTexts.visualizerPlace[langOption],
        section: fieldTexts.visualizerPlaceSection[langOption],
        type: 'select',
        options: ['Disabled', 'Navbar', 'Album Cover', 'Background'],
        default: 'Album Cover'
    },
    visualizerStartsFrom: {
        label: fieldTexts.visualizerStartsFrom[langOption],
        type: 'select',
        options: ['Left', 'Center', 'Right', 'Edges'],
        default: 'Center'
    },
    visualizerColor: {
        label: fieldTexts.visualizerColor[langOption],
        type: 'color',
        default: '#C800C8'
    },
    visualizerRgbEnabled: {
        label: fieldTexts.visualizerRgbEnabled[langOption],
        type: 'checkbox',
        default: true
    },
    visualizerFade: {
        label: fieldTexts.visualizerFade[langOption],
        type: 'checkbox',
        default: false
    },
    visualizerFft: {
        label: fieldTexts.visualizerFft[langOption],
        type: 'select',
        options: ['32', '64', '128', '256', '512', '1024', '2048', '4096', '8192', '16384'],
        default: '4096',
    },
    visualizerEnergySaverType: {
        label: fieldTexts.visualizerEnergySaverType[langOption],
        type: 'select',
        options: ['Disabled', 'Limit FPS', 'True Pause', 'Both'],
        default: 'Disabled'
    },
    visualizerCircleEnabled: {
        label: fieldTexts.visualizerCircleEnabled[langOption],
        type: 'checkbox',
        default: true,
    },
    visualizerRotate: {
        label: fieldTexts.visualizerRotate[langOption],
        type: 'select',
        options: ['Disabled', 'On', 'Reactive', 'Reactive (Bass)'],
        default: 'Disabled',
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerRotateDirection: {
        label: fieldTexts.visualizerRotateDirection[langOption],
        type: 'select',
        options: ['Clockwise', 'Counter-Clockwise'],
        default: 'Clockwise',
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerMove: {
        label: fieldTexts.visualizerMove[langOption],
        type: 'select',
        options: ['Inside', 'Outside', 'Both Sides'],
        default: 'Outside',
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerBassBounceEnabled: {
        label: fieldTexts.visualizerBassBounceEnabled[langOption],
        type: 'checkbox',
        default: true,
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerBassBounceSmooth: {
        label: fieldTexts.visualizerBassBounceSmooth[langOption],
        type: 'checkbox',
        default: true,
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerImageType: {
        label: fieldTexts.visualizerImageType[langOption],
        type: 'select',
        options: ['Disabled', 'Thumbnail', 'Custom'],
        default: 'Thumbnail',
        subCheckbox: 'visualizerCircleEnabled'
    },
    visualizerImageCustomURL: {
        label: fieldTexts.visualizerImageCustomURL[langOption],
        type: 'textarea',
        default: 'https://imgur.com/HSTpR8R.png',
        subCheckbox: 'visualizerCircleEnabled'
    },
    attention1: {
        label: fieldTexts.attention1[langOption],
        section: fieldTexts.attention1Section[langOption],
        type: 'hidden'
    },
    visualizerRgbRed: {
        label: fieldTexts.visualizerRgbRed[langOption],
        type: 'int',
        min: 0,
        max: 255,
        default: 255
    },
    visualizerRgbGreen: {
        label: fieldTexts.visualizerRgbGreen[langOption],
        type: 'int',
        min: 0,
        max: 255,
        default: 255
    },
    visualizerRgbBlue: {
        label: fieldTexts.visualizerRgbBlue[langOption],
        type: 'int',
        min: 0,
        max: 255,
        default: 255
    },
    visualizerRgbSamples: {
        label: fieldTexts.visualizerRgbSamples[langOption],
        type: 'int',
        min: 1,
        max: 8192,
        default: 512
    },
    visualizerMinDecibels: {
        label: fieldTexts.visualizerMinDecibels[langOption],
        type: 'int',
        min: -100,
        max: 0,
        default: -85
    },
    visualizerMaxDecibels: {
        label: fieldTexts.visualizerMaxDecibels[langOption],
        type: 'int',
        min: -100,
        max: 0,
        default: 0
    },
    visualizerSmoothing: {
        label: fieldTexts.visualizerSmoothing[langOption],
        type: 'float',
        min: 0,
        max: 1,
        default: 0.75
    },
    visualizerMinHertz: {
        label: fieldTexts.visualizerMinHertz[langOption],
        type: 'int',
        min: 0,
        max: 44100,
        default: 0
    },
    visualizerMaxHertz: {
        label: fieldTexts.visualizerMaxHertz[langOption],
        type: 'int',
        min: 1,
        max: 44100,
        default: 18450
    },
    visualizerBassBounceMinHertz: {
        label: fieldTexts.visualizerBassBounceMinHertz[langOption],
        type: 'float',
        min: 0,
        max: 44100,
        default: 0
    },
    visualizerBassBounceMaxHertz: {
        label: fieldTexts.visualizerBassBounceMaxHertz[langOption],
        type: 'float',
        min: 1,
        max: 44100,
        default: 100
    },
    visualizerBassBounceDebug: {
        label: fieldTexts.visualizerBassBounceDebug[langOption],
        type: 'checkbox',
        default: false
    },
    visualizerEnergySaverFps: {
        label: fieldTexts.visualizerEnergySaverFps[langOption],
        type: 'int',
        min: 1,
        max: 144,
        default: 30,
    },
    lastOpenCategory: {
        section: 'backend',
        type: 'hidden',
        default: -1
    }
};