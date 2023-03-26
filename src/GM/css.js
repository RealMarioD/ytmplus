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
    width: 3vmin;
    height: 3vmin;
    margin: 0;
    padding: 0;
}
input[type="text"] {
    width: 10.5vmin;
}
input {
    background-color: rgba(66, 66, 66, 0.8);
    font-size: 2vmin;
    border: none;
    border-radius: 1vmin;
    padding: 1vmin;
}
textarea {
    background-color: rgba(66, 66, 66, 0.8);
    width: 50%;
    height: 5vmin;
    resize: none;
    white-space: nowrap;
    overflow-wrap: normal;
    font-size: 2vmin;
    border: none;
    border-radius: 1vmin;
    padding: 1vmin;
    scrollbar-width: none;
}
textarea::-webkit-scrollbar {
    display: none;
}
#ytmPlusCfg .config_var {
    margin: 0 0 1%;
    text-align: left;
    height: 6vmin;
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
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1vmin;
    width: -webkit-fill-available;
    height: 12vmin;
}
#ytmPlusCfg .section_header_holder {
    margin-top: 0;
    display: none;
}
#ytmPlusCfg .section_header {
    margin-bottom: 0.5vmin;
    font-size: 4.5vmin;
}
#ytmPlusCfg .field_label {
    font-size: 2.5vmin;
    display: flex;
    align-items: center;
}
#ytmPlusCfg select {
    background-color: rgba(66, 66, 66, 0.8);
    font-size: 2vmin;
    border: none;
    border-radius: 1vmin;
    padding: 1vmin
}
#ytmPlusCfg .reset {
    color: rgba(255, 255, 255, 0.8);
}
#ytmPlusCfg_wrapper {
    height: -webkit-fill-available;
}
::-webkit-scrollbar {
    width: 1vmin;
    height: 0.5vmin;
}
::-webkit-scrollbar-track {
    background: #eeea;
    border-radius: 2vmin;
}
::-webkit-scrollbar-thumb {
    background: #888a;
    border-radius: 2vmin;
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
    background-color: rgba(66, 66, 66, 0.8);
    font-size: 2vmin;
    margin: 0;
    width: 49%;
    padding: 1vmin;
    border: solid 3px transparent;
    border-radius: 1vmin;
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #66003366, #33006666);
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 2px 1000px 1px #333 inset;
}
#ytmPlusCfg .saveclose_buttons:disabled {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #dd0055ee, #5500ddee);
}
#ytmPlusCfg .saveclose_buttons:hover {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #ff0077ff, #7700ffff);
}
#ytmPlusCfg .saveclose_buttons:active {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #6600eecc, #ee0066cc);
}
#ytmPlusCfg .reset_holder {
    margin: 4vmin 0;
}
#ytmPlusCfg .reset {
    font-size: 2vmin;
}
svg {
    width: inherit;
    height: inherit;
    margin: auto;
}
svg text {
    font-size: 10vmin;
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
    width: 40vmin;
    max-width: 40vmin;
    justify-content: center;
    border-right: solid #6666;
    display: flex;
    flex-direction: column;
    padding: 0 4vmin;
}
.changeCategoryButton {
    border: solid 3px transparent;
    border-radius: 1vmin;
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #66003366, #33006666);
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 2px 1000px 1px #333 inset;
    padding: 1vmin;
    margin-bottom: 2vmin;
}
.changeCategoryButton:disabled {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #dd0055ee, #5500ddee);
}
.changeCategoryButton:hover {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #ff0077ff, #7700ffff);
}
.changeCategoryButton:active {
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(90deg, #6600eecc, #ee0066cc);
}
#currentSettings {
    width: -webkit-fill-available;
    overflow: overlay;
    justify-content: center;
    display: flex;
    flex-direction: column;
    padding: 0 4vmin;
}
@-moz-document url-prefix() {
    #currentSettings {
        overflow: scroll;
    }
}`;