import { App, h } from './core';
import { AppLayer } from './layers/AppLayer';
import { Store } from '../store';
import { distance, Point, vectorLength, BezierPoint } from '../utils/geometry';
import { scaleDown, scaleUp } from './common';
import { clamp01 } from '../utils/math';

type Selection = {
  type: 'point' | 'handle';
  index: number;
};

type Grabbed = {
  mouseOrigin: Point;
  itemOrigin: BezierPoint;
  moved: boolean;
};

export type CState = {
  hovered: Selection | null;
  selected: Selection | null;
  grabbed: Grabbed | false;
  pointJustCreated: boolean;
};

export function mountCanvas(store: Store, el: HTMLCanvasElement): () => void {
  let canvasState: CState = {
    hovered: null,
    selected: null,
    grabbed: false,
    pointJustCreated: false,
  };

  const canvasApp = new App(h(AppLayer, { store, canvasState }), { startOnInit: true });
  canvasApp.mount(el);

  const onDown = (event: MouseEvent) => {
    const { x, y } = event;
    canvasState.pointJustCreated = false;

    if (canvasState.hovered !== null) {
      // select
      const points = store.getState().map(point => scaleUp(window.innerWidth, window.innerHeight, point));
      const selectedPoint = points[canvasState.hovered.index];
      canvasState.selected = { ...canvasState.hovered };
      canvasState.grabbed = {
        mouseOrigin: { x, y },
        itemOrigin: { ...selectedPoint },
        moved: false,
      };
      return;
    }

    const cliked = scaleDown(window.innerWidth, window.innerHeight, { x, y });
    if (cliked.x >= 0 && cliked.x <= 1) {
      // create
      const points = store.getState();
      const newPoint: BezierPoint = {
        ...cliked,
        c1: { x: 0.1, y: 0.1 },
        c2: { x: 0.1, y: 0.1 },
      };
      store.mutate(state => {
        state.push(newPoint);
      });
      canvasState.hovered = {
        type: 'point',
        index: points.length - 1,
      };
      canvasState.selected = { ...canvasState.hovered };
      canvasState.grabbed = {
        mouseOrigin: { x, y },
        itemOrigin: scaleUp(window.innerWidth, window.innerHeight, newPoint),
        moved: false,
      };
      canvasState.pointJustCreated = true;
    }
  };

  const onUp = (_event: MouseEvent) => {
    if (
      canvasState.selected !== null &&
      canvasState.pointJustCreated === false &&
      canvasState.grabbed &&
      canvasState.grabbed.moved === false
    ) {
      store.mutate(state => {
        if (canvasState.selected) {
          state.splice(canvasState.selected.index, 1);
        }
      });
    }
    canvasState.grabbed = false;
  };

  const onMove = (event: MouseEvent) => {
    const { x, y } = event;
    const mouse = { x, y };
    const points = store.getState().map(point => scaleUp(window.innerWidth, window.innerHeight, point));

    if (canvasState.grabbed !== false) {
      const diff = {
        x: mouse.x - canvasState.grabbed.mouseOrigin.x,
        y: mouse.y - canvasState.grabbed.mouseOrigin.y,
      };
      if (canvasState.grabbed.moved === false && vectorLength(diff) > 3) {
        canvasState.grabbed.moved = true;
      }
      if (canvasState.selected && canvasState.selected.type === 'handle') {
        // const newK = canvasState.grabbed.itemOrigin.k - diff.y / 50;
        // store.mutate(state => {
        //   if (canvasState.selected !== null) {
        //     state[canvasState.selected.index].k = newK;
        //   }
        // });
      } else {
        const newPos = scaleDown(window.innerWidth, window.innerHeight, {
          x: canvasState.grabbed.itemOrigin.x + diff.x,
          y: canvasState.grabbed.itemOrigin.y + diff.y,
        });
        newPos.x = clamp01(newPos.x);
        store.mutate(state => {
          if (canvasState.selected !== null) {
            state[canvasState.selected.index].x = newPos.x;
            state[canvasState.selected.index].y = newPos.y;
          }
        });
      }
      return;
    }

    canvasState.hovered = null;
    let found = false;
    const reversedPoints = [...points].reverse();
    // handles
    // reversedPoints.forEach((point, index) => {
    //   if (found) {
    //     return;
    //   }
    //   const handle = {
    //     x: point.x + 10,
    //     y: point.y - point.k * 50,
    //   };
    //   const dist = distance(handle, mouse);
    //   found = dist < 10;
    //   if (found) {
    //     canvasState.hovered = {
    //       type: 'handle',
    //       index: points.length - 1 - index,
    //     };
    //   }
    // });
    // points
    reversedPoints.forEach((point, index) => {
      if (found) {
        return;
      }
      const dist = distance(point, mouse);
      found = dist < 10;
      if (found) {
        canvasState.hovered = {
          type: 'point',
          index: points.length - 1 - index,
        };
      }
    });
  };

  const onEnter = (_event: MouseEvent) => {
    // console.log('onEnter');
  };

  const onLeave = (_event: MouseEvent) => {
    // console.log('onLeave');
    canvasState.selected = null;
    canvasState.hovered = null;
    canvasState.grabbed = false;
  };

  el.addEventListener('mousedown', onDown);
  el.addEventListener('mouseup', onUp);
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseenter', onEnter);
  el.addEventListener('mouseleave', onLeave);

  return () => {
    canvasApp.unmount();
  };
}
