import { injectStyle } from '../functions/backend/injectStyle';
import { elements } from '../globals/elements';
import keyframes from '../css/keyframes.css';
import { setupVisualizer } from '../functions/visualizer/init';
import { createCogFrame } from '../settingsMenu/createCogFrame';
import { toCallOnEvents } from '../events/toCallOnEvents';
import { ytmpConfig } from '../ytmpConfig';

export async function setup() {
    console.log('ytmPlus: Setup started.');
    try {
        elements.player = await document.getElementById('player');
        elements.playerPage = await document.getElementById('player-page');
        elements.playerPageDiv = elements.playerPage.firstElementChild;
        elements.navBarBg = await document.getElementById('nav-bar-background');
        elements.mainPanel = await document.getElementById('main-panel');
        const playlistFinder = await document.getElementsByClassName('side-panel style-scope ytmusic-player-page');
        elements.playlist = playlistFinder[0];
        elements.songImage = await document.getElementById('song-image');
        elements.songImage ? elements.songImage = elements.songImage.firstElementChild.firstElementChild : null;

        // Injecting animations for background and clock gradients
        injectStyle(keyframes);

        setupVisualizer();

        // Note: Everything below used to be timed out, now this whole setup function is timed out for safety lol
        // If stuff breaks just put back everything below in a timeout
        try {
            const guides = await document.getElementsByTagName('ytmusic-guide-section-renderer');
            elements.bigGuideItems = guides[0].children[2];
            elements.miniGuideItems = guides[2].children[2];
        }
        catch {
            if(!elements.miniGuideItems) console.warn('Could not find miniGuideItems!');
        }

        // Adds a settings button on the navbar
        createCogFrame();

        // Iterate through toCallOnEvents
        for(const fn in toCallOnEvents) {
            try {
                toCallOnEvents[fn](ytmpConfig.get(fn));
                console.log(`Loaded ${fn} on setup.`);
            }
            catch (error) {
                console.error(`Failed to call ${fn} on setup:`);
                console.error(error);
            }
        }
        console.log('ytmPlus(windowLoad): Setup finished.');
    }
    catch (error) {
        console.error('ytmPlus(windowLoad): Setup failed.');
        console.error(error);
    }
}