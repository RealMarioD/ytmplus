import settingsMenu from './css/settingsMenu.css';
import { injectElement } from './functions/backend/injectElement';
import { fixupFields } from './settingsMenu/fields';

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
        customButton: {
            default: 'Change',
            toNode: function() {
                const configId = 'ytmPlusCfg';
                const field = this.settings,
                    id = this.id,
                    create = this.create,
                    format = (field.format || '1'),
                    slash = null,
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
                    id: configId + '_field_' + id + '_',
                    className: 'userButtons',
                    type: 'button',
                    value: 'Change',
                    onclick: field.click,
                };
                retNode.appendChild(create('input', props));
                if(slash) retNode.appendChild(slash);

                return retNode;
            }
        }
    }
});