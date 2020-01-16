import {pi, tau} from "../math.js";

/**
 * 绘制圆形符号
 * */
export default {
  /** context可以是W3C规范的SVG或者canvas画布，也可以是D3的路径生成器 */
  draw: function(context, size) {
    var r = Math.sqrt(size / pi);
    context.moveTo(r, 0);
    context.arc(0, 0, r, 0, tau);
  }
};
