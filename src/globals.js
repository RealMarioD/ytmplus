import { GM_config } from './GM/GM_config';
import { visualizerResizeFix } from './visualizer/init';

export const globals = {
    settingsOpen: false, // Used to track if config window is open or not
    playerPage: undefined,
    playerPageDiv: undefined, // Set to the player "overlay" in window.onload
    player: undefined, // Has the sizes we need for album cover canvas
    upgradeButton: undefined, // Set to the upgrade "button" in window.onload
    originalUpgradeText: undefined, // OGUpgrade text can differ based on YTM language
    clockFunction: undefined, // Holds the interval function that updates the digital clock
    noAfkFunction: undefined, // Holds the anti-afk interval function
    noPromoFunction: undefined, // Holds the no promotions function
    skipDislikedFunction: undefined, // Holds the skip disliked songs function
    dumbFix: 0, // idek what to type here, DOMSubtreeModified fires twice, this helps code run only once lmao
    navBarBg: undefined, // Holds the navbar bg's div, visualizer canvas is injected into its innerHTML
    mainPanel: undefined, // Holds something from around the album cover, - - | | - -
};

export const visualizer = {
    place: undefined,
    startsFrom: undefined,
    color: undefined,
    fade: undefined,
    circleEnabled: undefined,
    rotate: undefined,
    rotateDirection: undefined,
    move: undefined,
    energySaver: {
        type: undefined,
        fps: undefined,
        _frameMinTime: undefined,
        _getFMT: function(fps) { visualizer.energySaver._frameMinTime = (1000 / 60) * (60 / fps) - (1000 / 60) * 0.5; }
    },
    image: {
        type: undefined,
        customURL: undefined
    },
    rgb: {
        enabled: undefined,
        red: undefined,
        green: undefined,
        blue: undefined,
        samples: undefined,
        _data: []
    },
    bassBounce: {
        enabled: undefined,
        minHertz: undefined,
        maxHertz: undefined,
        smooth: undefined,
        debug: undefined,
        _barStart: undefined,
        _barEnd: undefined,
        _calcBars() {
            this._barStart = ~~(this.minHertz / (44100 / visualizer.analyser.fftSize));
            this._barEnd = ~~(this.maxHertz / (44100 / visualizer.analyser.fftSize));
            if(this._barEnd === 0) this._barEnd++;
        }
    },
    keepHertz: undefined,
    colorDivergence: undefined,
    analyser: undefined,
    bufferLength: undefined,
    audioData: undefined,
    resizeInterval: undefined,
    getBufferData() {
        this.analyser.fftSize = GM_config.get('visualizerFft');
        this.keepHertz = GM_config.get('visualizerKeepHertz');
        this.bufferLength = ~~(this.keepHertz / (44100 / visualizer.analyser.fftSize));
        this.audioData = new Uint8Array(this.bufferLength);
    },
    /**
     * Visualizer keys must have identical names with their GM_config equivalent, e.g.: visualizer.place = 'visualizerPlace'
     * Following this rule we can iterate through the visualizer object and automatically get all configs and their values.
     * (bassBounce is the last thing it checks so any values that should be initialised/changed upon saving should be set above bassBounce)
     */
    initValues() {
        for(const key in this) {
            let gmName;

            if(typeof this[key] !== 'object') {
                gmName = 'visualizer' + key[0].toUpperCase() + key.slice(1, key.length); // e.g.: visualizer + P + lace
                this[key] = GM_config.get(gmName);
                continue;
            }

            for(const key2 in this[key]) {
                if(key2[0] === '_') continue;
                gmName = 'visualizer' +
                key[0].toUpperCase() + key.slice(1, key.length) + // B + assBounce
                key2[0].toUpperCase() + key2.slice(1, key2.length); // E + nabled

                this[key][key2] = GM_config.get(gmName);
            }

            if(key !== 'bassBounce') continue;

            // Last things to do (everything here runs only once)
            if(this.analyser !== undefined) {
                this.analyser.smoothingTimeConstant = GM_config.get('visualizerSmoothing');
                this.analyser.minDecibels = GM_config.get('visualizerMinDecibels');
                this.analyser.maxDecibels = GM_config.get('visualizerMaxDecibels');
                this.bassBounce._calcBars();
            }

            this.colorDivergence = this.bufferLength / this.rgb.samples;
            if(this.rgb.enabled === true && this.rgb._data.length !== this.rgb.samples) this.getRGB();

            if(this.energySaver.type === 'Limit FPS' || this.energySaver.type === 'Both') this.energySaver._getFMT(this.energySaver.fps);
            else this.energySaver._getFMT(60);

            clearInterval(visualizer.resizeInterval);
            if(this.place !== 'Disabled') visualizer.resizeInterval = setInterval(() => visualizerResizeFix(), 1000);
            return; // So we don't check anything beyond bassBounce
        }
    },
    getRGB() { // Pregenerates RGB colors so we don't have to calculate colors every frame
        const hue = 2 * Math.PI / this.rgb.samples,
            piD3 = Math.PI / 3, // Offset
            piD3x2 = 2 * Math.PI / 3; // so that colors aren't totally mixed together

        this.rgb._data = [];
        for(let i = 0; i < this.rgb.samples; i++) {
            this.rgb._data[i] = {
                red: Math.abs(this.rgb.red * Math.sin(i * hue)),
                green: Math.abs(this.rgb.green * Math.sin(i * hue + piD3)),
                blue: Math.abs(this.rgb.blue * Math.sin(i * hue + piD3x2))
            };
        }
    }
};