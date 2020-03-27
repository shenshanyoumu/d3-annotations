import namespace from "./namespace";
import {xhtml} from "./namespaces";

// d3-selection的能力基于DOM规范，因此需要为宿主环境赋予正确的DTD

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    
    /** 一般document页面默认基于XHTML规范解析，并直接创建DOM节点即可；
     * 否则在特定的namespaceURI创建DOM元素*/
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

/** document对象方法 */
function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, 
      fullname.local);
  };
}

/** selection选择器不仅仅针对HTML，还针对XHTML、XML等，
 * 因此需要指定宿主解析的文档类型和版本
 *  */
export default function(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}
