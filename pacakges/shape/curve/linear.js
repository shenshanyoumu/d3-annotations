/**--------------------------------------- */
// line由point序列定义；
// area由两条lines定义，其中一条线称为baseline,而另一条线称为topline。
// 但是points要真正构出连续状的线段，需要进行插值。因此curve就是一系列插值函数
/**--------------------------------------- */
// 注意context参数定义的绘图方法会映射到SVG对应标签
function Linear(context) {
  this._context = context;
}

// 对points序列线性插值，构成折线图形
Linear.prototype = {
  // area片段也是由两条线段构成，其中一条为baseline；而另一条为topline
  // _line和_point控制area片段和线段的绘制过程
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },

  // 线段由point序列构成
  lineStart: function() {
    this._point = 0;
  },

  lineEnd: function() {
    // 如果存在area片段，并且点序列终结，则根据点序列绘制一个封闭的区域
    if (this._line || (this._line !== 0 && this._point === 1)) {
      this._context.closePath();
    }

    this._line = 1 - this._line;
  },
  point: function(x, y) {
    (x = +x), (y = +y);
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;
      case 1:
        this._point = 2; // proceed
      default:
        this._context.lineTo(x, y); //下面调用lineTo就是一种线性插值形式
        break;
    }
  }
};

export default function(context) {
  return new Linear(context);
}
