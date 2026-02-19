import { functions } from '../../globals/functions';
import { logger } from '../backend/logger';

export function neverAfk(turnOn) { // Credit to q1k - https://greasyfork.org/en/users/1262-q1k
    clearInterval(functions.noAfkFunction);
    if(!turnOn) return;
    functions.noAfkFunction = setInterval(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 }));
        logger.debug('Nudged the page so user is not AFK.');
    }, 15000);
}