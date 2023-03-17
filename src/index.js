import { keydownEvent, loadEvent } from './window/events';

window.addEventListener('keydown', (ev) => keydownEvent(ev));

window.addEventListener('load', () => loadEvent());