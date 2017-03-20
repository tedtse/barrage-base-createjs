/*
 * 参见 https://segmentfault.com/a/1190000000426283 
 */

export default function tplEngine (tpl, data) {
  let reg = /<%([^%>]+)?%>/g;
  let regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
  let cursor = 0;
  let code = 'var r = [];\n';
  let match;
  let add = function (line, js) {
    if (js) {
      code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n';
    } else {
      code += 'r.push("' + line.replace(/"/g, '\\"') + '");\n';
    }
    return add;
  }
  while (match = reg.exec(tpl)) {
    add(tpl.slice(cursor, match.index))(match[1], true);
    cursor = match.index + match[0].length;
  }
  add(tpl.substr(cursor, tpl.length - cursor));
  code += 'return r.join("")';
  return new Function(code).apply(data);
}