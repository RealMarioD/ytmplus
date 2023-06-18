import { ytmpConfig } from '../../ytmpConfig';

export function sortSubs() {
    try {
        for(const field in ytmpConfig.fields) {
            const currentField = ytmpConfig.fields[field];

            let sub = currentField.settings.subCheckbox || currentField.settings.subOption;
            if(!sub) continue;

            currentField.wrapper.firstElementChild.style.paddingLeft = '4%';

            let selectOption;
            sub = sub.split('.');
            const subToggle = ytmpConfig.fields[sub[0]];
            if(sub.length === 2) selectOption = parseInt(sub[1]);

            if(subToggle.settings.type === 'checkbox') {
                if(subToggle.value === true) currentField.wrapper.style.display = 'flex';
                else currentField.wrapper.style.display = 'none';
                subToggle.node.addEventListener('change', e => {
                    if(e.target.checked === true) currentField.wrapper.style.display = 'flex';
                    else currentField.wrapper.style.display = 'none';
                });
            }
            else if(subToggle.settings.type === 'select') {
                if(subToggle.node.selectedIndex === selectOption) currentField.wrapper.style.display = 'flex';
                else currentField.wrapper.style.display = 'none';
                subToggle.node.addEventListener('change', e => {
                    if(e.target.selectedIndex === selectOption) currentField.wrapper.style.display = 'flex';
                    else currentField.wrapper.style.display = 'none';
                });
            }
        }
    }
    catch (error) {
        console.error(error);
    }
}