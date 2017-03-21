import Container from '../elements/Container';

export function generatePipes (opts) {
  let result = [];
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