import { configFields } from './fields';

export const fieldTexts = {
    language: { english: '<span title="Refresh for changes">Language↻</span>', hungarian: '<span title="Frissíts a változásokhoz">Nyelv↻</span>' },
    langSection: { english: 'Utilities', hungarian: 'Hasznosságok' },
    neverAfk: { english: 'Never AFK', hungarian: 'Sosem AFK' },
    noPromotions: { english: 'No Promotions', hungarian: 'Promóciók kikapcsolása' },
    skipDisliked: { english: 'Skip Disliked Songs', hungarian: 'Nem kedvelt dalok kihagyása' },
    fixLayout: { english: 'Fix Layout', hungarian: 'Elrendezés javítása' },
    extraPlaybackButtons: { english: 'Extra Playback Buttons', hungarian: 'Több Irányító Gomb' },
    removeAlbumCover: { english: 'Remove Album Cover', hungarian: 'Album Borító Eltávolítása' },
    swapMainPanelWithPlaylist: { english: 'Swap Album Cover with Playlist', hungarian: 'Album Borító és Lejátszási Lista felcserélése' },
    changeNavbarBackground: { english: 'Change Navbar Background' },
    themeSection: { english: 'Theme Settings', hungarian: 'Téma beállítások' },
    navbarBackgroundColor: { english: 'Color', hungarian: 'Szín' },
    changeBackground: { english: 'Change Background', hungarian: 'Háttér megváltoztatása' },
    changeBackgroundSection: { english: 'Background Settings', hungarian: 'Háttér beállítások' },
    bgColor: { english: 'Background Color', hungarian: 'Háttérszín' },
    bgEnableGradient: { english: 'Enable Background Gradient', hungarian: 'Háttér színátmenet engedélyezése' },
    bgGradient: { english: 'Background Gradient Color', hungarian: 'Háttér színátmenet' },
    bgGradientAngle: { english: 'Gradient Angle', hungarian: 'Színátmenet Irány' },
    bgGradientAnimation: { english: 'Gradient Animation', hungarian: 'Színátmenet Animáció' },
    changeUpgradeButton: { english: 'Change "Upgrade" Button', hungarian: '"Bővítés" Gomb Cserélése' },
    clockSection: { english: 'Upgrade Button', hungarian: 'Bővítés Gomb' },
    clockColor: { english: 'Clock Color', hungarian: 'Óra Színe' },
    clockGradient: { english: 'Enable Gradient', hungarian: 'Színátmenet Engedélyezése' },
    clockGradientColor: { english: 'Gradient Color', hungarian: 'Színátmenet' },
    clockGradientAngle: { english: 'Gradient Angle', hungarian: 'Színátmenet Irány' },
    clockGradientAnimation: { english: 'Gradient Animation', hungarian: 'Színtámenet Animáció' },
    visualizerPlace: { english: 'Visualizer Place', hungarian: 'Vizualizáló Helye' },
    visualizerPlaceSection: { english: 'Music Visualizer', hungarian: 'Zene Vizualizáló' },
    visualizerStartsFrom: { english: 'Visualizer Starts from', hungarian: 'Vizualizáló innen kezdődik:' },
    // visualizerStartsFromOptions: { english: ['Left', 'Center', 'Right', 'Edges'], hungarian: ['Bal', 'Közép', 'Jobb', 'Szélek'] },
    visualizerColor: { english: 'Visualizer Color', hungarian: 'Vizualizáló Színe' },
    visualizerRgbEnabled: { english: 'RGB Mode', hungarian: 'RGB Mód' },
    visualizerFade: { english: 'Enable Bar Fade', hungarian: 'Sávok Áttűnésének Engedélyezése' },
    visualizerFft: { english: '<span title="High values can affect performance and can break circle visualizer.">Audio Samples⚠</span>', hungarian: '<span title="Magas értékek befolyásolhatják a teljesítményt és hibát okozhatnak a kör vizualizálóban.">Hang Minták⚠</span>' },
    visualizerEnergySaverType: { english: 'Energy Saver', hungarian: 'Energiatakarékos mód' },
    visualizerCircleEnabled: { english: 'Circle Visualizer', hungarian: 'Kör Vizualizáló' },
    visualizerRotate: { english: 'Rotation', hungarian: 'Forgás' },
    visualizerRotateDirection: { english: 'Rotation Direction', hungarian: 'Forgásirány' },
    visualizerMove: { english: 'Bars Movement Direction', hungarian: 'Sávok Mozgásiránya' },
    visualizerBassBounceEnabled: { english: 'Bass Bounce', hungarian: 'Basszusugrálás' },
    visualizerBassBounceSmooth: { english: 'Smooth Bounce', hungarian: 'Ugrálás Simítása' },
    visualizerImageType: { english: 'Visualizer Image', hungarian: 'Vizualizáló Kép' },
    visualizerImageCustomURL: { english: 'Custom Image URL', hungarian: 'Egyéni Kép URL' },
    attention1: { english: 'Changes here can cause glitches!', hungarian: 'Az itteni változtatások hibákat okozhatnak!' },
    attention1Section: { english: 'Advanced Visualizer Settings', hungarian: 'Speciális Vizualizáló Beállítások' },
    visualizerRgbRed: { english: 'RGB:Red', hungarian: 'RGB:Piros' },
    visualizerRgbGreen: { english: 'RGB:Green', hungarian: 'RGB:Zöld' },
    visualizerRgbBlue: { english: 'RGB:Blue', hungarian: 'RGB:Kék' },
    visualizerRgbSamples: { english: 'RGB:Samples', hungarian: 'RGB:Minták' },
    visualizerMinDecibels: { english: 'Min Decibels', hungarian: 'Min Decibel' },
    visualizerMaxDecibels: { english: 'Max Decibels', hungarian: 'Max Decibel' },
    visualizerSmoothing: { english: 'Smoothening', hungarian: 'Simítás' },
    visualizerMinHertz: { english: 'AudioData Min Hertz', hungarian: 'AudioData Min Hertz' },
    visualizerMaxHertz: { english: 'AudioData Max Hertz', hungarian: 'AudioData Max Hertz' },
    visualizerBassBounceMinHertz: { english: 'Bass Bounce Min Hertz', hungarian: 'Basszusugrálás Min Hertz' },
    visualizerBassBounceMaxHertz: { english: 'Bass Bounce Max Hertz', hungarian: 'Basszusugrálás Max Hertz' },
    visualizerBassBounceDebug: { english: 'Bass Bounce Debug Color', hungarian: 'Basszusugrálás Debug Szín' },
    visualizerEnergySaverFps: { english: 'Energy Saver FPS', hungarian: 'Energiatakarékos FPS' },
    backendSection: { english: 'You are not supposed to see this.' },
    lastOpenCategory: { english: 'You are not supposed to see this.' }
};

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
        configFields[field] = Object.assign(newLabel, configFields[field]);

        if(configFields[field].section === undefined) continue;

        configFields[field].section = configFields[field].section[langOption] || configFields[field].section['english'];
    }
    return configFields;
}