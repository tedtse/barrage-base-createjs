/**
 * createjs Container 对象封装
 * @module Container
 */

var Container;
(function (root) {
  Container = class {
    constructor () {
      this.set({
        tagName: 'CONTAINER'
      });
    }
    addChildren () {
      let args = Array.prototype.slice.call(arguments);
      if (!args.length) {
        return;
      }
      args.forEach((child) => {
        this.addChild(child);
      });
      this.calcSize();
    }
    calcSize () {
      let selfWidth = 0;
      let selfHeight = 0;
      this.children.forEach((child) => {
        if (child.tagName !== 'TEXT') {
          selfWidth += ((child.x || 0) + (child.width || 0));
          selfHeight = Math.max(selfHeight, ((child.y || 0) + (child.height || 0)));
        } else {
          selfWidth += ((child.x || 0) + (child.getMeasuredWidth() || 0));
          selfHeight = Math.max(selfHeight, ((child.y || 0) + (child.getMeasuredHeight() || 0)));
        }
      });
      this.set({
        width: selfWidth,
        height: selfHeight
      });
    }
  }
  root.createjs.extend(Container, root.createjs.Container);
}) (window);

export default Container;

