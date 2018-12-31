import { Store } from '../store';
import { render } from 'react-dom';
import { App } from './App';
import React from 'react';

export function mountUI(store: Store, rootElement: HTMLDivElement) {
  function renderApp() {
    render(<App state={store.getState()} />, rootElement);
  }
  renderApp();
  store.subscribe(() => {
    renderApp();
  });
}
