import settingsMenu from './css/settingsMenu.css';
import { injectElement } from './functions/backend/injectElement';
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
        customSelect: customSelect
    }
});