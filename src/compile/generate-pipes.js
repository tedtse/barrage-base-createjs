import Container from '../elements/Container';
import { CANVAS } from '../feature';

var defaultPipeOpts = { height: 15, marginTop: 15, marginBottom: 0, number: 2 };
export function _generatePipes () {
  let result = [];
  let opts = Object.assign({ ...defaultPipeOpts, width: CANVAS.width });
  for (let i = 0; i < opts.number; i++) {
    let pipe = new window.createjs.Container();
    pipe.set({
      id: i,
      name: 'pipe',
      status: 'idle',
      width: opts.width,
      height: opts.height,
      x: 0,
      y: i * opts.height + (i + 1) * opts.marginTop + (Math.max(0, (i - 1))) * opts.marginBottom
    });
    result.push(pipe);
  }
  return result;
}

export function extendGeneratePipes (newFunc) {
  if (typeof newFunc !== 'function') {
    return;
  }
  generatePipes = newFunc;
}