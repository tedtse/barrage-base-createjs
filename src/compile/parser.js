var loadXML;
(function (root) {
  loadXML = function (xmlString) {
    let xmlDoc = null;
    // 判断浏览器的类型
    // 支持IE浏览器 
    if (!root.DOMParser && root.ActiveXObject) {
      let xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
      for (let i = 0; i < xmlDomVersions.length; i++) {
        try {
          xmlDoc = new ActiveXObject(xmlDomVersions[i]);
          xmlDoc.async = false;
          xmlDoc.loadXML(xmlString); // loadXML方法载入xml字符串
          break;
        } catch (e) {}
      }
    } else if (root.DOMParser && document.implementation && document.implementation.createDocument) {
      //支持Mozilla浏览器
      try {
        /*
         * DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
         * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
         * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
         * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
         */
        let domParser = new root.DOMParser();
        xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
      } catch (e) {}
    } else {
      return null;
    }
    return xmlDoc;
  }
}) (window);

export { loadXML };