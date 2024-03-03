export const visualizer = {
    place: undefined,
    startsFrom: undefined,
    color: undefined,
    fade: undefined,
    circleEnabled: undefined,
    rotate: undefined,
    rotateDirection: undefined,
    move: undefined,
    renderScale: undefined,
    shake: {
        enabled: undefined,
        threshold: undefined,
        multiplier: undefined,
        _normalized: undefined
    },
    energySaver: {
        type: undefined,
        fps: undefined,
        _frameMinTime: undefined
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
        threshold: undefined,
        minHertz: undefined,
        maxHertz: undefined,
        calculation: undefined,
        smooth: undefined,
        debug: undefined,
        _barStart: undefined,
        _barEnd: undefined
    },
    canvases: {
        navbar: undefined,
        albumCover: undefined,
        background: undefined,
        playerBackground: undefined
    },
    values: {
        WIDTH: undefined,
        HEIGHT: 1,
        halfWidth: undefined,
        halfHeight: undefined,
        xPosOffset: undefined,
        barTotal: undefined,
        barTotalHalf: undefined,
        barWidth: undefined,
        barSpace: undefined,
        barHeight: undefined,
        circleSize: undefined,
        radius: 1,
        minRadius: 1,
        maxRadius: 1,
        innerRadius: undefined,
        outerRadius: undefined,
        rotationValue: 0,
        bass: undefined,
        bassSmoothRadius: 1,
        reactiveBarHeightMultiplier: undefined,
        startingPoint: -(0.5 * Math.PI)
    },
    video: undefined,
    audioContext: undefined,
    src: undefined,
    canvas: undefined,
    ctx: undefined,
    minHertz: undefined,
    maxHertz: undefined,
    removedBeginning: undefined,
    removedEnding: undefined,
    colorDivergence: undefined,
    analyser: undefined,
    bufferLength: undefined,
    normalizedAudioData: [],
    audioData: undefined,
    audioDataStep: undefined,
    audioDataLength: undefined,
    resizeInterval: undefined
};