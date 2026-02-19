import { functions } from '../../globals/functions.js';
import { logger } from '../backend/logger.js';

export function noPromotions(turnOn) {
    clearInterval(functions.noPromotions);
    if(!turnOn) return;
    functions.noPromotions = setInterval(() => {
        const popup = document.getElementsByTagName('ytmusic-mealbar-promo-renderer');
        if(popup.length > 0) {
            popup[0].remove();
            logger.log('Removed a promotion.');
        }
    }, 1000);
}