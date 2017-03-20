/**
 * 将xml 的 dom 对象 转化为 createjs 对象
 */

import Container from '../elements/Container';
import Text from '../elements/Text';
import setting from '../setting';
import { loadXML } from './parser';
import { getStyleByAttribute } from './css-parser';
import tplEngine from './template-engine';

function generateFragment (tagName, style) {
  let result;
  tagName = tagName.toLowercase();
  switch (tagName) {
    case 'container':
      result = new Container(style);
      break;
    // case
  }
}

function iterator (parent) {
  let role = parent.getAttribute('role');
  let style = getStyleByAttribute(`role=${role}`);
  parent.render(style);
  if (parent.tagName.toLowercase() === 'container') {
    let children = parent.childNodes;
    children.forEach((child) => {
      let nodeType = child.nodeType;
      if (nodeType !== 1 || nodeType !== 11) {
        return;
      }

    });
  }
}

export function generateBullet (canvasWidth, data) {
  let tpl = tplEngine(require('../bullet.tpl'));
  let xmlDoc = loadXML(tpl);
  console.log(xmlDoc);
  console.log(getStyleByAttribute('role="new-comment"'));
}

generateBullet();