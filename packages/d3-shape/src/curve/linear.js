/**
 * 线段生成器，用于生成一系列点
 * @param {*} context 
 */
function Linear(context) {
  this._context = context;
}

/** 线段由点构成；封闭区域由线段合围而成 */
Linear.prototype = {
  /** 在线段生成器中，封闭的区域图形由两组line segments组成。
   * _line取值0或者NaN都表示空
   */
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  /**
   * _point取值0或者1都表示没有线段
   */
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 1))
       this._context.closePath();

    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; 
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; // proceed
      default: this._context.lineTo(x, y); break;
    }
  }
};

export default function(context) {
  return new Linear(context);
}
