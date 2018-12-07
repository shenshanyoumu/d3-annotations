import curveLinear from "./linear";

export var curveRadialLinear = curveRadial(curveLinear);

// 基于放射状的插值器，在Tree图中Links线段的端点处采用Radial插值可以生成平滑的效果
function Radial(curve) {
  this._curve = curve;
}

Radial.prototype = {
  areaStart: function() {
    this._curve.areaStart();
  },
  areaEnd: function() {
    this._curve.areaEnd();
  },
  lineStart: function() {
    this._curve.lineStart();
  },
  lineEnd: function() {
    this._curve.lineEnd();
  },

  // 参数分别为Links端点插值过程中处理的系列点与端点的角度和距离
  point: function(a, r) {
    // 虽然curve是线性插值器，但是在调用point进行连线插值时，外部调用了三角函数来形成曲线效果
    this._curve.point(r * Math.sin(a), r * -Math.cos(a));
  }
};

export default function curveRadial(curve) {
  function radial(context) {
    return new Radial(curve(context));
  }

  radial._curve = curve;

  return radial;
}
