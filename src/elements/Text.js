/**
 * createjs Text 对象封装
 * @module Text
 */

var Text;
(function (root) {
  Text = class {
    constructor (text, font, color) {
      this.set({
        tagName: 'TEXT'
      });
    }
  }
  root.createjs.extend(Text, root.createjs.Text)
  Text.prototype.draw = function (ctx, ignoreCache) {
    this.Text_draw(ctx, ignoreCache);
    this.hitArea.graphics.clear().beginFill('#ffffff').drawRect(0, 0, this.getMeasuredWidth(), this.getMeasuredHeight());
  };
  Text.prototype.handleEvent = function (evt) {};
  root.createjs.promote(Text, 'Text');
}) (window);

export default Text;
