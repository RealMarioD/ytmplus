export const configCSS =
`input[type="color"] {
    -webkit-appearance: none;
    border: 0;
    padding: 0;
    width: 2.5vh;
    height: 2.5vh;
}
input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}
input[type="color"]::-webkit-color-swatch {
    border: 0;
}
input[type="color"], input[type="checkbox"] {
    width: 2vh;
    height: 2vh;
}
input[type="text"] {
    width: 8vh;
}
input {
    vertical-align: middle;
    background-color: rgba(66, 66, 66, 0.8);
    font-size: 2vh;
}
textarea {
    background-color: rgba(66, 66, 66, 0.8);
    width: 75%;
    height: 3.5vh;
    resize: none;
    margin: auto;
    white-space: nowrap;
    overflow-wrap: normal;
}
#ytmPlusCfg .config_var {
    margin: 0 0 0.5vh;
    text-align: center;
}
@-moz-document url-prefix() {
    #cfgHolder {
        overflow-y: scroll;
    }
}
#ytmPlusCfg * {
    font-family: monospace;
    color: rgba(255, 255, 255, 0.8);
}
#ytmPlusCfg {
    background-color: rgba(0, 0, 0, 0.9);
}
#ytmPlusCfg #ytmPlusCfg_header {
    font-size: 7vh;
    background: -webkit-linear-gradient(-45deg, rgb(170, 25, 25), rgb(25, 25, 170));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0.5vh 0;
}
#ytmPlusCfg .section_header_holder {
    margin-top: 0;
}
#ytmPlusCfg .section_header {
    margin-bottom: 0.5vh;
    font-size: 2.5vh;
}
#ytmPlusCfg .field_label {
    font-size: 2.5vh;
    vertical-align: middle;
}
#ytmPlusCfg select {
    vertical-align: middle;
    background-color: rgba(66, 66, 66, 0.8);
    font-size: 2vh;
}
#ytmPlusCfg .reset {
    color: rgba(255, 255, 255, 0.8);
}
::-webkit-scrollbar {
    width: 1vw;
    height: 0.5vh;
}
::-webkit-scrollbar-track {
    background: #eeea;
    border-radius: 2vw;
}
::-webkit-scrollbar-thumb {
    background: #888a;
    border-radius: 2vw;
}
::-webkit-scrollbar-thumb:hover {
    background: #555f;
}
svg text {
    font-size: 17vw;
    animation: stroke 10s infinite alternate linear;
    stroke-width: 2;
    stroke: #aa0000;
}
@keyframes stroke {
    0%   {
        fill: rgba(200,0,85,0.25); stroke: rgba(170,0,85,1);
        stroke-dashoffset: 25%; stroke-dasharray: 10%; stroke-width: 3;
    }
    100% {
        fill: rgba(200,0,85,0.25); stroke: rgba(170,0,85,1);
        stroke-dashoffset: -25%; stroke-dasharray: 10%;
    }
}
#cfgHolder {
    overflow-y: overlay;
    max-height: 80vh;
    display: block;
}`;