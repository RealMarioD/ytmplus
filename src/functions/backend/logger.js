export class logger {
    static log(message) {
        console.log('%c[YTMPLUS] INFO:', 'background: #60A; color: #FFF', message);
    }
    static warn(message) {
        console.warn('%c[YTMPLUS] WARNING:', 'background: #FA2; color: #000', message);
    }
    static error(message) {
        console.error('%c[YTMPLUS] ERROR:', 'background: #A00; color: #FFF', message);
    }
    static debug(message) {
        console.debug('%c[YTMPLUS] DEBUG:', 'background: #666; color: #FFF', message);
    }
}