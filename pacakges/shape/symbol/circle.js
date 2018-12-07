import { pi, tau } from "../math";

// 圆形符号生成器，其实调用了canvas/SVG对应的圆形生成函数
export default {
  draw: function(context, size) {
    var r = Math.sqrt(size / pi);
    context.moveTo(r, 0);
    context.arc(0, 0, r, 0, tau);
  }
};
