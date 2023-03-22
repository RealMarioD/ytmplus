import { fieldTexts } from './fieldTexts';

export let langOption = GM_getValue('ytmPlusCfg', 'english');
if(langOption != 'english') {
    langOption = JSON.parse(langOption).lang;
    if(!langOption) langOption = 'english';
    else langOption = langOption.charAt(0).toLowerCase() + langOption.slice(1);
}

// 'type': 'color'; just results in a text input, they are later converted to actual color input, see open event
export const configFields = {
    lang: {
        label: fieldTexts.lang[langOption],
        section: fieldTexts.langSection[langOption],
        type: 'select',
        options: ['English', 'Hungarian'],
        default: 'English'
    },
    noAfk: {
        label: fieldTexts.noAfk[langOption],
        type: 'checkbox',
        default: true
    },
    noPromo: {
        label: fieldTexts.noPromo[langOption],
        type: 'checkbox',
        default: true
    },
    skipDisliked: {
        label: fieldTexts.skipDisliked[langOption],
        type: 'checkbox',
        default: false
    },
    padding: {
        label: fieldTexts.padding[langOption],
        type: 'checkbox',
        default: true
    },
    extraButtons: {
        label: fieldTexts.extraButtons[langOption],
        type: 'checkbox',
        default: true
    },
    removeThumbnail: {
        label: fieldTexts.removeThumbnail[langOption],
        type: 'checkbox',
        default: true
    },
    section0: {
        type: 'hidden',
        value: 'open',
        default: 'open'
    },
    bg: {
        label: fieldTexts.bg[langOption],
        section: fieldTexts.bgSection[langOption],
        type: 'checkbox',
        default: true
    },
    bgColor: {
        label: fieldTexts.bgColor[langOption],
        type: 'color',
        default: '#AA0000'
    },
    bgEnableGradient: {
        label: fieldTexts.bgEnableGradient[langOption],
        type: 'checkbox',
        default: true
    },
    bgGradient: {
        label: fieldTexts.bgGradient[langOption],
        type: 'color',
        default: '#0000AA'
    },
    section1: {
        type: 'hidden',
        value: 'open',
        default: 'open'
    },
    clock: {
        label: fieldTexts.clock[langOption],
        section: fieldTexts.clockSection[langOption],
        type: 'select',
        options: ['Original', 'Remove Button', 'Digital Clock'],
        default: 'Digital Clock'
    },
    clockColor: {
        label: fieldTexts.clockColor[langOption],
        type: 'color',
        default: '#AA3333'
    },
    clockGradient: {
        label: fieldTexts.clockGradient[langOption],
        type: 'checkbox',
        default: true
    },
    clockGradientColor: {
        label: fieldTexts.clockGradientColor[langOption],
        type: 'color',
        default: '#3333AA'
    },
    section2: {
        type: 'hidden',
        value: 'open',
        default: 'open'
    },
    visualizerPlace: {
        label: fieldTexts.visualizerPlace[langOption],
        section: fieldTexts.visualizerPlaceSection[langOption],
        type: 'select',
        options: ['Disabled', 'Navbar', 'Album Cover'],
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
        default: '1024',
    },
    visualizerEnergySaverType: {
        label: fieldTexts.visualizerEnergySaverType[langOption],
        type: 'select',
        options: ['Disabled', 'Limit FPS', 'True Pause', 'Both'],
        default: false
    },
    section3: {
        type: 'hidden',
        value: 'open',
        default: 'open'
    },
    visualizerCircleEnabled: {
        label: fieldTexts.visualizerCircleEnabled[langOption],
        section: fieldTexts.visualizerCircleEnabledSection[langOption],
        type: 'checkbox',
        default: true
    },
    visualizerRotate: {
        label: fieldTexts.visualizerRotate[langOption],
        type: 'select',
        options: ['Disabled', 'On', 'Reactive', 'Reactive (Bass)'],
        default: 'Disabled'
    },
    visualizerRotateDirection: {
        label: fieldTexts.visualizerRotateDirection[langOption],
        type: 'select',
        options: ['Clockwise', 'Counter-Clockwise'],
        default: 'Clockwise'
    },
    visualizerMove: {
        label: fieldTexts.visualizerMove[langOption],
        type: 'select',
        options: ['Inside', 'Outside', 'Both Sides'],
        default: 'Outside'
    },
    visualizerBassBounceEnabled: {
        label: fieldTexts.visualizerBassBounceEnabled[langOption],
        type: 'checkbox',
        default: true
    },
    visualizerBassBounceSmooth: {
        label: fieldTexts.visualizerBassBounceSmooth[langOption],
        type: 'checkbox',
        default: true
    },
    visualizerImageType: {
        label: fieldTexts.visualizerImageType[langOption],
        type: 'select',
        options: ['Disabled', 'Thumbnail', 'Custom'],
        default: 'Thumbnail'
    },
    visualizerImageCustomURL: {
        label: fieldTexts.visualizerImageCustomURL[langOption],
        type: 'textarea',
        default: 'https://yt3.googleusercontent.com/ytc/AL5GRJX3OEex8FqN1gogsXQZNB7fV9TVHfda2EynDiW9_g=s900-c-k-c0x00ffffff-no-rj'
    },
    section4: {
        type: 'hidden',
        value: 'open',
        default: 'open'
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
        min: 0.0,
        max: 1.0,
        default: 0.5
    },
    visualizerCutOff: {
        label: fieldTexts.visualizerCutOff[langOption],
        type: 'float',
        min: 0,
        max: 0.9999,
        default: 0.1625
    },
    visualizerBassBounceSensitivityStart: {
        label: fieldTexts.visualizerBassBounceSensitivityStart[langOption],
        type: 'float',
        min: 0,
        max: 1,
        default: 0
    },
    visualizerBassBounceSensitivityEnd: {
        label: fieldTexts.visualizerBassBounceSensitivityEnd[langOption],
        type: 'float',
        min: 0.00001,
        max: 1,
        default: 0.004
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
    section5: {
        type: 'hidden',
        value: 'closed',
        default: 'closed'
    }
};