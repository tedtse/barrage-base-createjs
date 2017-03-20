/**
 * createjs Stage 对象封装
 * @module Stage
 */

var Stage;
(function (root) {
  Stage = class {
    constructor (id) {
      this.set({
        tagName: 'STAGE'
      });
      this.enableMouseOver(20);
      root.createjs.Ticker.setFPS(60);
      root.createjs.Ticker.addEventListener('tick', stage);
    }
  }
  root.createjs.extend(Stage, root.createjs.Stage);
}) (window);

export default Stage;
