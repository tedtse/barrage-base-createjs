import Stage from './elements/Stage'
import { generatePipes } from './compile/generate-pipes'
import { generateBullet } from './compile/generate-bullet'
import { setting } from './setting'

var defaultPipeOpts = { height: 0, marginTop: 10, marginBottom: 15, number: 2 };
module.exports = {
  init (barrage) {
    barrage.stage = new Stage(setting.id);
    barrage.canvas = document.getElementById(setting.id);
    if (setting.auto) {
      barrage.autoLaunch();
    }
    // 初始化pipes
    let pipeOpts = Object.assign({ ...defaultPipeOpts, ...setting.pipeOpts, width: barrage.canvas.width });
    let pipes = generatePipes(pipeOpts);
    pipes.forEach((pipe) => {
      barrage.stage.addChild(pipe);
    })
  },
  generatePipes: generatePipes,
  generateBullet: generateBullet
}