import { trim } from '../utils/tool';
import { matchExpr } from '../utils/selector';
import { sheet } from '../bullet-css';

var stylesById = {};
var stylesByClass = {};
var stylesByTag = {};
var stylesByAttr = {};

for (let key in sheet) {
  let arr = key.split(',');
  arr.forEach((selector) => {
    selector = trim(selector);
    classify(selector, sheet[key]);
  });
}

function classify (selector, value) {
  let match;
  if (match = selector.match(matchExpr['ID'])) {
    let id = match[1];
    stylesById[id] = Object.assign({ ...stylesById[id] || {}, ...value });
  } else if (match = selector.match(matchExpr['CLASS'])) {
    let className = match[1];
    stylesByClass[className] = Object.assign({ ...stylesByClass[className] || {}, ...value });
  } else if (match = selector.match(matchExpr['TAG'])) {
    let tag = match[1];
    stylesByTag[tag] = Object.assign({ ...stylesByTag[tag] || {}, ...value });
  } else if (match = selector.match(matchExpr['ATTR'])) {
    let attr = `${match[1]}${match[2]}${match[3]}`;
    stylesByAttr[attr] = Object.assign({ ...stylesByAttr[attr] || {}, ...value });
  }
}

export function getStyleById (id) {
  return stylesById[id];
}

export function getStyleByClass (className) {
  return stylesByClass[className];
}

export function getStyleByTag (tag) {
  return stylesByTag[tag];
}

export function getStyleByAttribute (attr) {
  attr = attr.replace(/\"/g, '');
  return stylesByAttr[attr];
}
