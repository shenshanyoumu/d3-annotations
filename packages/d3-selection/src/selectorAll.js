function empty() {
  return [];
}

/** 基于W3C规范，注意返回是函数而不是计算值。
 *  querySelectorAll会遍历整个DOM树，返回符合要求的节点集合 */
export default function(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}
