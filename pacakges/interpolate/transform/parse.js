import decompose, { identity } from "./decompose";

var cssNode, cssRoot, cssView, svgNode;

// CSS可以支持transform属性，则对transform的属性值解析并转换为内部的转换结构
export function parseCss(value) {
  if (value === "none") {
    return identity;
  }
  if (!cssNode)
    (cssNode = document.createElement("DIV")),
      (cssRoot = document.documentElement),
      (cssView = document.defaultView);
  // 直接操作DOM节点的transform属性
  cssNode.style.transform = value;
  value = cssView
    .getComputedStyle(cssRoot.appendChild(cssNode), null)
    .getPropertyValue("transform");
  cssRoot.removeChild(cssNode);

  // value就是一个类似变换矩阵的结构
  value = value.slice(7, -1).split(",");
  return decompose(
    +value[0],
    +value[1],
    +value[2],
    +value[3],
    +value[4],
    +value[5]
  );
}

export function parseSvg(value) {
  if (value == null) return identity;
  if (!svgNode)
    svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}
