import settingsMenu from './css/settingsMenu.css';
import { injectElement } from './functions/backend/injectElement';
import { logger } from './functions/backend/logger';
import { fixupFields } from './settingsMenu/fields';

const customButton = {
    default: 'Change',
    toNode: function() {
        const configId = 'ytmPlusCfg';
        const field = this.settings,
            id = this.id,
            create = this.create,
            format = (field.format || '1'),
            retNode = create('div', {
                className: 'config_var',
                id: configId + '_' + id + '_var',
                title: field.title || ''
            });

        this.format = format;

        retNode.appendChild(create('label', {
            innerHTML: field.label + '<br>' + ytmpConfig.get(field.valueStorage).split('|')[1],
            id: configId + '_' + id + '_field_label',
            for: configId + '_field_' + id,
            className: 'field_label'
        }));

        const props = {
            id: configId + '_field_' + id,
            className: 'userButtons',
            type: 'button',
            value: 'Change',
            onclick: field.click,
        };
        retNode.appendChild(create('input', props));

        return retNode;
    },
    toValue: function() { return; },
    reset: function() { return; }
};

// ALL THIS BULLSHIT SO THAT SELECT INPUTS CAN CHANGE LANGUAGE
const customSelect = {
    default: null,
    toNode: function() {
        const configId = 'ytmPlusCfg';
        const field = this.settings,
            id = this.id,
            create = this.create,
            options = field.options,
            retNode = create('div', {
                className: 'config_var',
                id: configId + '_' + id + '_var',
                title: field.title || ''
            });

        retNode.appendChild(create('label', {
            innerHTML: field.label,
            id: configId + '_' + id + '_field_label',
            for: configId + '_field_' + id,
            className: 'field_label'
        }));

        const props = {
            id: configId + '_field_' + id,
        };
        const selectInput = retNode.appendChild(create('select', props));
        this.node = selectInput;
        for(let i = 0; i < options.length; i++) {
            selectInput.appendChild(create('option', {
                innerHTML: options[i],
                value: field.rawOptions[i],
            }));
        }
        field.value = this.value;
        selectInput.value = this.value;

        return retNode;
    },
    toValue: function() {
        let returnValue = null;
        if(this.wrapper) {
            const selectInput = this.wrapper.children[1];
            returnValue = selectInput.value;
        }
        return returnValue;
    },
    reset: function() {
        if(this.wrapper) {
            const selectInput = this.wrapper.children[1];
            selectInput.value = this.default;
            this.settings.value = this.default;
        }
        return;
    }
};

// Helper functions for customColorRgb
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
}

function rgbToHex(rgb) {
    // rgb is an array [r, g, b]
    if(!Array.isArray(rgb) || rgb.length !== 3) return '#000000';

    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];

    // Convert to hex
    const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const customColorRgb = {
    default: '#000000',
    toNode: function() {
        const configId = 'ytmPlusCfg';
        const field = this.settings,
            id = this.id,
            create = this.create,
            retNode = create('div', {
                className: 'config_var',
                id: configId + '_' + id + '_var',
                title: field.title || ''
            });

        retNode.appendChild(create('label', {
            innerHTML: field.label,
            id: configId + '_' + id + '_field_label',
            for: configId + '_field_' + id,
            className: 'field_label'
        }));

        // Convert RGB array to hex for the input
        let hexValue = this.value;
        if(Array.isArray(this.value)) hexValue = rgbToHex(this.value);

        const props = {
            id: configId + '_field_' + id,
            type: 'color', // Will be changed to 'color' in openEvent
            value: hexValue
        };

        field.value = this.value;

        retNode.appendChild(create('input', props));
        return retNode;
    },
    toValue: function() {
        logger.debug('customColorRgb toValue called');
        if(this.wrapper) {
            const input = this.wrapper.querySelector('input');
            if(input && input.value) {
                // Convert hex to RGB
                return hexToRgb(input.value);
            }
        }
        return this.value || this.default;
    },
    reset: function() {
        if(this.wrapper) {
            const input = this.wrapper.querySelector('input');
            if(input) {
                let hexValue = this.default;
                if(Array.isArray(this.default)) hexValue = rgbToHex(this.default);
                input.value = hexValue;
            }
        }
    }
};

export const ytmpConfig = new GM_configStruct({
    id: 'ytmPlusCfg',
    title: 'ytmPlus',
    fields: fixupFields(),
    css: settingsMenu,
    // Moved to index.js so no more circular dependecies (yay?)
    // events: {
    //     open: openEvent,
    //     save: saveEvent
    // },
    frame: injectElement('div', 'ytmPlusCfg', document.body, undefined, 'display: flex'),
    types: {
        customButton: customButton,
        customSelect: customSelect,
        customColorRgb: customColorRgb
    }
});