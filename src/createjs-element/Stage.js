/**
 * createjs Container 对象封装
 * @module Container
 */

class Stage {
  constructor (id) {
    let stage = new window.createjs.Stage(id);
    stage.enableMouseOver(20);
    window.createjs.Ticker.setFPS(60);
    window.createjs.Ticker.addEventListener('tick', stage);
  }
}