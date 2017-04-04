import Stage from './elements/Stage'
import { _generatePipes } from './compile/generate-pipes'
import { _generateBullet } from './compile/generate-bullet'
import { setting } from './setting'
import { STAGE, setStage, setCanvas, setGenerateBullet, setGeneratePipes, generatePipes } from './feature';

module.exports = function (barrage) {
  setStage(new Stage(setting.id));
  setCanvas(document.getElementById(setting.id));
  setGenerateBullet(_generateBullet);
  setGeneratePipes(_generatePipes);
  let pipes = generatePipes();
  pipes.forEach((pipe) => {
    STAGE.addChild(pipe);
  });
  if (setting.auto) {
    barrage.autoLaunch();
  }
}