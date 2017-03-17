/**
 * createjs Container 对象封装
 * @module Container
 */

class Container {
  constructor () {
    let container = new window.createjs.Container();
    let selfWidth = 0;
    let selfHeight = 0;
    container.children.forEach((child) => {
      if (child.tagName !== 'TEXT') {
        selfWidth += ((child.x || 0) + (child.width || 0));
        selfHeight = Math.max(selfHeight, ((child.y || 0) + (child.height || 0)));
      } else {
        selfWidth += ((child.x || 0) + (child.getMeasuredWidth() || 0));
        selfHeight = Math.max(selfHeight, ((child.y || 0) + (child.getMeasuredHeight() || 0)));
      }
    });
    container.set({
      tagName: 'CONTAINER',
      width: selfWidth,
      height: selfHeight
    });
    return container;
  }
}