import { keydownEvent } from './events/settingsOpenClose';
import { setup } from './events/windowLoad';

window.addEventListener('keydown', (e) => keydownEvent(e));

window.addEventListener('load', () => setup());