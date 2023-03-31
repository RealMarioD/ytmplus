export const debugging = false;

export function logplus(...logs) {
    if(debugging === false) return;
    switch(logs[0]) {
        case 'error': {
            logs.shift();
            for(const data of logs) console.error('ytmPlus: ' + data);
            break;
        }
        case 'warn': {
            logs.shift();
            for(const data of logs) console.warn('ytmPlus: ' + data);
            break;
        }
        default: for(const data of logs) console.log('ytmPlus: ' + data); break;
    }
}