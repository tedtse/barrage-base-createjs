// http://www.w3.org/TR/css3-selectors/#whitespace
const WHITESPACE = '[\\x20\\t\\r\\n\\f]';
// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
const IDENTIFIER = '(?:\\\\.|[\\w-]|[^\0-\\xa0])+';
// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
const ATTRIBUTES = '\\[' + WHITESPACE + '*(' + IDENTIFIER + ')(?:' + WHITESPACE +
  // Operator (capture 2)
  '*([*^$|!~]?=)' + WHITESPACE +
  // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
  '*(?:"((?:\\\\.|[^\\\\"])*)"|\'((?:\\\\.|[^\\\\\'])*)\'|(' + IDENTIFIER + '))|)' + WHITESPACE +
  '*\\]';

var matchExpr = {
  'ID': new RegExp( '^#(' + IDENTIFIER + ')' ),
  'CLASS': new RegExp( '^\\.(' + IDENTIFIER + ')' ),
  'TAG': new RegExp( '^(' + IDENTIFIER + '|[*])' ),
  'ATTR': new RegExp( '^' + ATTRIBUTES )
};

export { matchExpr };