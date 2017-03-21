/**
 * createjs Text 对象封装
 * @module Text
 */

var Text;
(function (root) {
  Text = class {
    constructor (text, font, color) {
      // 去掉换行
      text = text.replace(/[\r\n]/g, '');
      this.Text_constructor(text, font, color);
      this.hitArea = new root.createjs.Shape();
      this.textBaseline = 'top';

      this.addEventListener('rollover', this);
      this.addEventListener('rollout', this);
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
