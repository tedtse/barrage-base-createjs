/**
 * 将xml 的 dom 对象 转化为 createjs 对象
 */

import Container from '../elements/Container';
import Text from '../elements/Text';
import { setting } from '../setting';
import { tplEngine } from './template-engine';
import { loadXML } from './parser';
import { getStyleByAttribute } from './css-parser';
import { CANVAS } from '../feature';

function containerRender () {
  return new Container();
}

function textRender (text, style) {
  let font = style.font || '';
  let color = style.color || '';
  return new Text(text, font, color);
}

function generateFragment (element, style) {
  let result;
  let tagName = element.tagName.toLowerCase();
  switch (tagName) {
    case 'container':
      result = containerRender();
      break;
    case 'text':
      let text = element.innerHTML;
      result = textRender(text, style);
  }
  return result;
}

function iterator (parent) {
  let role = parent.getAttribute('role');
  let style = getStyleByAttribute(`role=${role}`);
  let _parent = generateFragment(parent, style);
  if (parent.tagName.toLowerCase() === 'container') {
    let children = parent.childNodes;
    let _children = [];
    children.forEach((child) => {
      let nodeType = child.nodeType;
      if (nodeType !== 1) {
        return;
      }
      let _child = iterator(child);
      _children.push(_child);
    });
    _parent.addChildren.apply(_parent, _children);
  }
  return _parent;
}

export function _generateBullet (data) {
  return new Promise((resolve, reject) => {
    let tpl = tplEngine(setting.tplOpts.template, data);
    let xmlDoc = loadXML(tpl);
    let bullet = iterator(xmlDoc.firstChild);
    bullet.set({
      name: 'bullet',
      x: CANVAS.width,
      y: 0
    });
    resolve(bullet);
  });
}

export function extendGenerateBullet (newFunc) {
  if (typeof newFunc !== 'function') {
    return;
  }
  generateBullet = newFunc;
}
