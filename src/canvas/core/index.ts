import sync, { cancelSync, FrameData, Process } from 'framesync';
import { notNull } from '../../utils/invariant';
import {
  $$TYPE,
  ElementType,
  OperationElement,
  LayerElement,
  flattenElements,
  isElement,
  isOperation,
  CanvasElement,
  Layer,
} from './types';
import { OperationFactory, createOperationFactory } from './OperationFactory';

type Screen = {
  resolutionWidth: number;
  resolutionHeight: number;
  width: number;
  height: number;
  pixelRatio: number;
};

type Anchor = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export function h<Props>(layer: Layer<Props>, props: Props): LayerElement {
  return {
    [$$TYPE]: ElementType.Element,
    layer,
    props,
  };
}

type AppOptions = {
  startOnInit?: boolean;
};

export class App {
  private screen: Screen | null = null;
  private anchor: Anchor | null = null;
  private process: Process | null = null;
  private factory: OperationFactory = createOperationFactory();
  private rootElements: Array<CanvasElement>;

  constructor(rootElement: CanvasElement | Array<CanvasElement>, options: AppOptions) {
    this.rootElements = Array.isArray(rootElement) ? rootElement : [rootElement];

    this.setup();
    if (options.startOnInit !== false) {
      this.start();
    }
  }

  private setup() {
    const pixelRatio = window.devicePixelRatio;
    this.screen = {
      resolutionWidth: window.innerWidth * pixelRatio,
      resolutionHeight: window.innerHeight * pixelRatio,
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio,
    };
    if (this.anchor) {
    }
  }

  private applyCanvasOperation(ope: OperationElement) {
    if (this.anchor) {
      if (ope.property) {
        (this.anchor.ctx as any)[ope.type] = ope.args[0];
      } else {
        (this.anchor.ctx as any)[ope.type](...ope.args);
      }
    }
  }

  private draw = ({ timestamp, delta }: FrameData) => {
    if (this.anchor && this.screen) {
      let next = [...this.rootElements];

      let limit = 10000;
      while (limit > 0) {
        limit--;
        next = flattenElements<Array<CanvasElement>>(
          next.map(elem => {
            if (isElement(elem)) {
              return elem.layer(this.factory, elem.props, { timestamp, delta, ...notNull(this.screen) });
            }
            return elem;
          })
        ).filter(elem => elem !== null);
        if (next.filter(elem => !isOperation(elem)).length === 0) {
          break;
        }
      }

      next.forEach(elem => {
        if (isOperation(elem)) {
          this.applyCanvasOperation(elem);
        } else {
          console.warn('whaaat ?');
        }
      });
    }
  };

  onResize = () => {
    console.log('resize');
    this.setup();
    if (this.anchor) {
      this.mount(this.anchor.canvas);
    }
  };

  mount = (elem: HTMLCanvasElement) => {
    const ctx = notNull(elem.getContext('2d'));
    this.anchor = {
      canvas: elem,
      ctx,
    };
    if (this.screen) {
      elem.width = this.screen.resolutionWidth;
      elem.height = this.screen.resolutionHeight;
    } else {
      throw new Error('Missing screen !');
    }
    window.addEventListener('resize', this.onResize);
  };

  unmount = () => {
    this.anchor = null;
    window.removeEventListener('resize', this.onResize);
  };

  start = () => {
    if (this.process === null) {
      this.process = sync.update(this.draw, true);
    } else {
      console.warn('Already started');
    }
  };

  stop = () => {
    if (this.process) {
      cancelSync.update(this.process);
    }
  };
}
