/* eslint-disable no-undef */
export const globals = {
    settingsOpen: false, // Used to track if config window is open or not
    playerPageDiv: undefined, // Set to the player "overlay" in window.onload
    upgradeButton: undefined, // Set to the upgrade "button" in window.onload
    originalUpgradeText: undefined,
    clockFunction: undefined, // Holds the interval function that updates the digital clock
    noAfkFunction: undefined, // Holds the anti-afk interval function
    noPromoFunction: undefined, // Holds the no promotions function
    skipDislikedFunction: undefined, // Holds the skip disliked songs function
    dumbFix: 0, // idek what to type here, DOMSubtreeModified fires twice, this helps code run only once lmao
    navBarBg: undefined, // Holds the navbar bg's div, visualizer canvas is injected into its innerHTML
    mainPanel: undefined, // Holds something from around the album cover, - - | | - -
    visualizer: {
        place: undefined,
        startsFrom: undefined,
        color: undefined,
        fade: undefined,
        circleEnabled: undefined,
        rotate: undefined,
        rotateDirection: undefined,
        move: undefined,
        cutOff: 0.1625,
        rgb: {
            enabled: undefined,
            red: undefined,
            green: undefined,
            blue: undefined,
            samples: undefined
        },
        bassBounce: {
            enabled: null,
            sensitivityStart: null,
            sensitivityEnd: null,
            smooth: null,
            debug: null
        },
        rgbData: [],
        analyser: undefined,
        bufferLength: null,
        dataArray: null,
        getBufferData() {
            this.analyser.fftSize = GM_config.get('visualizerFft');
            this.bufferLength = this.analyser.frequencyBinCount - Math.floor(this.analyser.frequencyBinCount * this.cutOff); // We cut off the end because data is 0, making visualizer's end flat
            this.dataArray = new Uint8Array(this.bufferLength);
        },
        initValues() {
            /**
             * Visualizer keys must have identical names with their GM_config equivalent, e.g.: visualizer.place = 'visualizerPlace'
             * Following this rule we can iterate through the visualizer object and automatically get all configs and their values.
             * (bassBounce is the last thing it checks so any values that should be initialised/changed upon saving should be set above bassBounce)
             */
            for(const key in this) {
                if(Object.hasOwnProperty.call(this, key)) {
                    let gmName = `visualizer${key[0].toUpperCase()}${key.slice(1, key.length)}`;
                    if(typeof this[key] == 'object') {
                        for(const key2 in this[key]) {
                            if(Object.hasOwnProperty.call(this[key], key2)) {
                                gmName = `visualizer${key[0].toUpperCase() + key.slice(1, key.length) + key2[0].toUpperCase() + key2.slice(1, key2.length)}`;
                                this[key][key2] = GM_config.get(gmName);
                            }
                        }
                        if(key == 'bassBounce') return;
                        if(this.analyser !== undefined) {
                            this.analyser.smoothingTimeConstant = GM_config.get('visualizerSmoothing');
                            this.analyser.minDecibels = GM_config.get('visualizerMinDecibels');
                            this.analyser.maxDecibels = GM_config.get('visualizerMaxDecibels');
                        }
                    }
                    else this[key] = GM_config.get(gmName);
                }
            }
        },
        getRGB() {
            const hue = 2 * Math.PI / this.rgb.samples, piD3 = Math.PI / 3, piD3x2 = 2 * Math.PI / 3;
            this.rgbData = [];
            for(let i = 0; i < this.rgb.samples; i++) {
                this.rgbData[i] = {
                    red: Math.abs(this.rgb.red * Math.sin(i * hue)),
                    green: Math.abs(this.rgb.green * Math.sin(i * hue + piD3)),
                    blue: Math.abs(this.rgb.blue * Math.sin(i * hue + piD3x2))
                };
            }
        }
    }
};