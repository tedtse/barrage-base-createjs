/**
 * createjs Stage 对象封装
 * @module Stage
 */

var Stage;
(function (root) {
  Stage = class extends root.createjs.Stage {
    constructor (id) {
      super(id);
      this.set({
        tagName: 'STAGE'
      });
      this.enableMouseOver(20);
      root.createjs.Ticker.setFPS(60);
      root.createjs.Ticker.addEventListener('tick', this);
    }
  }
}) (window);

export default Stage;
