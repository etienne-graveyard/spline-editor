import { notNull } from './utils/invariant';
import { mountUI } from './ui';
import { createStore } from './store';
import 'normalize.css';
import './index.css';
import { mountCanvas } from './canvas';

const store = createStore([
  { x: 0, y: 0.5, c1: { x: 0.1, y: 0.1 }, c2: { x: 0.1, y: 0.1 } },
  { x: 0.5, y: 1, c1: { x: 0.1, y: 0.1 }, c2: { x: 0.1, y: 0.1 } },
  { x: 1, y: 0, c1: { x: 0.1, y: 0.1 }, c2: { x: 0.1, y: 0.1 } },
]);

const uiEl = notNull(document.getElementById('app-ui'));
mountUI(store, uiEl as any);

const canvasEl = notNull(document.getElementById('app-canvas'));
mountCanvas(store, canvasEl as any);
