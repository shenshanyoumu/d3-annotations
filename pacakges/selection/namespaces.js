export var xhtml = "http://www.w3.org/1999/xhtml";

// 由于SVG委员会制定了不同版本的规范，因此浏览器在解析SVG时需要根据相应的命名空间调用对应的解析器
export default {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
