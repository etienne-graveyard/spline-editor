import { BezierPoint } from '../utils/geometry';

export type State = Array<BezierPoint>;

export type Listener = () => void;

export type Store = {
  subscribe(listener: Listener): () => void;
  getState(): State;
  mutate(mutation: (state: State) => void): void;
};

export function createStore(initialState: State = []): Store {
  const listeners: Array<Listener> = [];

  let state: State = initialState;

  function subscribe(listener: Listener): () => void {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  function getState(): State {
    return state;
  }

  function mutate(mutation: (state: State) => void): void {
    mutation(state);
    listeners.forEach(listener => listener());
  }

  return {
    subscribe,
    getState,
    mutate,
  };
}
