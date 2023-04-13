export const configCSS =
`input[type="color"] {
    -webkit-appearance: none;
    border: none;
    padding: 0;
}
input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}
input[type="color"]::-webkit-color-swatch {
    border: 0;
}
input[type="color"], input[type="checkbox"] {
    width: 3vh;
    height: 3vh;
    margin: 0;
    padding: 0;
}
input[type="text"] {
    width: 10.5vh;
}
input {
    background-color: rgba(66, 66, 66, 0.8);
    font-size: 2.5vh;
    border: none;
    border-radius: 1vh;
    padding: 1vh;
}
textarea {
    background-color: rgba(66, 66, 66, 0.8);
    width: 50%;
    height: 5vh;
    resize: none;
    white-space: nowrap;
    overflow-wrap: normal;
    font-size: 2.5vh;
    border: none;
    border-radius: 1vh;
    padding: 1vh;
    scrollbar-width: none;
}
textarea::-webkit-scrollbar {
    display: none;
}
#ytmPlusCfg .config_var {
    margin: 0 0 1%;
    text-align: left;
    height: 6vh;
    display: flex;
    flex-wrap: no-wrap;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1px #6666
}
#ytmPlusCfg * {
    font-family: monospace;
    color: rgba(255, 255, 255, 0.8);
}
#ytmPlusCfg {
    background-color: rgba(0, 0, 0, 0.95);
}
#ytmPlusCfg #ytmPlusCfg_header {
    background: -webkit-linear-gradient(-45deg, rgb(170, 25, 25), rgb(25, 25, 170));
    display: flex;
    flex-direction: column;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: auto 0;
    width: -webkit-fill-available;
    height: 12vh;
}
#ytmPlusCfg .section_header_holder {
    margin-top: 0;
    display: none;
}
#ytmPlusCfg .section_header {
    margin-bottom: 0.5vh;
    font-size: 4.5vh;
}
#ytmPlusCfg .field_label {
    font-size: 3vh;
    display: flex;
    align-items: center;
}
#ytmPlusCfg select {
    background-color: rgba(66, 66, 66, 0.8);
    font-size: 2.5vh;
    border: none;
    border-radius: 1vh;
    padding: 1vh
}
#ytmPlusCfg_wrapper {
    display: flex;
    height: 100%;
    /* height: -webkit-fill-available; */
}
::-webkit-scrollbar {
    width: 1vh;
    height: 0.5vh;
}
::-webkit-scrollbar-track {
    background: #eeea;
    border-radius: 2vh;
}
::-webkit-scrollbar-thumb {
    background: #888a;
    border-radius: 2vh;
}
::-webkit-scrollbar-thumb:hover {
    background: #555f;
}
#ytmPlusCfg_buttons_holder {
    text-align: center;
}
#ytmPlusCfg #ytmPlusCfg_saveBtn {
    margin-right: 2%;
}
#ytmPlusCfg .saveclose_buttons {
    font-size: 2.5vh;
    margin: 0;
    width: 49%;
    padding: 1.5vh;
    border: solid 3px transparent;
    border-radius: 1vh;
    background: rgba(66, 66, 66, 0.8);
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(45deg, var(--borderColor2), var(--borderColor1), var(--borderColor2));
    background-size: 200% 100%;
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 2px 1000px 1px #333 inset;
    animation: buttonBorder 2s infinite forwards linear;
}
#ytmPlusCfg .saveclose_buttons:disabled {
    --borderColor1: #dd0055ee;
    --borderColor2: #5500ddee;
    animation: buttonBorder 2s infinite forwards linear;
}
#ytmPlusCfg .saveclose_buttons:hover {
    --borderColor1: #ff0077ff;
    --borderColor2: #7700ffff;
    animation: buttonBorder 1s infinite forwards linear;
}
#ytmPlusCfg .saveclose_buttons:active {
    --borderColor1: #6600eecc;
    --borderColor2: #ee0066cc;
    animation: buttonBorder 0.5s infinite forwards linear;
}
#ytmPlusCfg .reset_holder {
    margin: 4vh 0 auto;
    text-align: center;
}
#ytmPlusCfg .reset {
    font-size: 2vh;
    color: rgba(255, 255, 255, 0.8);
}
svg {
    width: inherit;
    height: inherit;
    margin: auto;
}
svg text {
    font-size: 9vh;
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
    display: flex;
    height: 100%;
}
#categorySelect {
    min-width: 30vw;
    width: 30vw;
    max-width: 30vw;
    justify-content: flex-start;
    border-right: solid #6666;
    display: flex;
    flex-direction: column;
    padding: 0 4vh;
}
:root {
    --borderColor1: #66003366;
    --borderColor2: #33006666;
}
@keyframes buttonBorder {
    0% {
        background-position: 0% center;
    }
    100% {
        background-position: 200% center;
    }
}
.changeCategoryButton {
    border: solid 3px transparent;
    border-radius: 1vh;
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(45deg, var(--borderColor2), var(--borderColor1), var(--borderColor2));
    background-size: 200% 100%;
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 2px 1000px 1px #333 inset;
    padding: 1.5vh;
    margin-bottom: 2vh;
    height: auto;
    white-space: pre-wrap;
    animation: buttonBorder 2s infinite forwards linear;
}
.changeCategoryButton:disabled {
    --borderColor1: #dd0055ee;
    --borderColor2: #5500ddee;
    animation: buttonBorder 2s infinite forwards linear;
}
.changeCategoryButton:hover {
    --borderColor1: #ff0077ff;
    --borderColor2: #7700ffff;
    animation: buttonBorder 1s infinite forwards linear;
}
.changeCategoryButton:active {
    --borderColor1: #6600eecc;
    --borderColor2: #ee0066cc;
    animation: buttonBorder 0.5s infinite forwards linear;
}
#currentSettings {
    width: -moz-available;
    width: -webkit-fill-available;
    overflow: overlay;
    justify-content: center;
    display: flex;
    flex-direction: column;
    padding: 0 4vh;
}
@-moz-document url-prefix() {
    #currentSettings {
        overflow: scroll;
    }
}`;