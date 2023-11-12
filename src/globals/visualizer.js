export const visualizer = {
    place: undefined,
    startsFrom: undefined,
    color: undefined,
    fade: undefined,
    circleEnabled: undefined,
    rotate: undefined,
    rotateDirection: undefined,
    move: undefined,
    shake: {
        enabled: undefined,
        threshold: undefined
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
        minHertz: undefined,
        maxHertz: undefined,
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
        barWidth: undefined,
        barSpace: undefined,
        barHeight: undefined,
        circleSize: undefined,
        radius: 1,
        heightModifier: 1,
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
    colorDivergence: undefined,
    analyser: undefined,
    bufferLength: undefined,
    audioData: undefined,
    resizeInterval: undefined
};