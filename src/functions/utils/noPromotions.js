import { functions } from '../../globals/functions.js';

export function noPromotions(turnOn) {
    clearInterval(functions.noPromotions);
    if(!turnOn) return;
    functions.noPromotions = setInterval(() => {
        const popup = document.getElementsByTagName('ytmusic-mealbar-promo-renderer');
        if(popup.length > 0) {
            popup[0].remove();
            console.log('Removed a promotion.');
        }
    }, 1000);
}