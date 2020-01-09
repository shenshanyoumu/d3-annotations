import decompose, {identity} from "./decompose.js";

var cssNode,
    cssRoot,
    cssView,
    svgNode;

/**
 * 
 * @param {*} value CSS值
 */
export function parseCss(value) {
  if (value === "none")
     return identity;
  
  /** 其实就是DOM节点 */
  if (!cssNode) {
    cssNode = document.createElement("DIV"), cssRoot = document.documentElement, 
    cssView = document.defaultView;
  
  }
  
  /** 对DOM节点的transform样式属性进行赋值 */
  cssNode.style.transform = value;

  /**
   * getComputedStyle获得特定DOM节点的CSSStyleDeclaration对象
   * getPropertyValue获得CSSStyleDeclaration对象中transform属性值
   */
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");

  cssRoot.removeChild(cssNode);
  
  /** 从value字符串第7位开始一直到倒数第2位结束，并且按照逗号分隔 */
  /** transform属性值包括平移、旋转、剪切、缩放等操作 */
  value = value.slice(7, -1).split(",");

  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

export function parseSvg(value) {
  if (value == null) return identity;

  /** 浏览器针对不同的ECMA规范进行实现，因此需要指定版本 */
  if (!svgNode){
    svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  }

  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) 
    return identity;

  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}
