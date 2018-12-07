//
export function point(that, x, y) {
  that._context.bezierCurveTo(
    that._x1 + that._k * (that._x2 - that._x0),
    that._y1 + that._k * (that._y2 - that._y0),
    that._x2 + that._k * (that._x1 - x),
    that._y2 + that._k * (that._y1 - y),
    that._x2,
    that._y2
  );
}

// 基数插值器生成曲线，tension表示插值张量
export function Cardinal(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

// 下面这几个方法就是Grammar of Graphics的精髓，任何曲线/封闭区域都可以用下面几个方法实现；
// 不同曲线的的生成在于调用了不同的点插值算法
Cardinal.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        point(this, this._x1, this._y1);
        break;
    }
    if (this._line || (this._line !== 0 && this._point === 1))
      this._context.closePath();
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
        this._point = 2;
        (this._x1 = x), (this._y1 = y);
        break;
      case 2:
        this._point = 3; // proceed
      default:
        point(this, x, y);
        break;
    }
    (this._x0 = this._x1), (this._x1 = this._x2), (this._x2 = x);
    (this._y0 = this._y1), (this._y1 = this._y2), (this._y2 = y);
  }
};

export default (function custom(tension) {
  function cardinal(context) {
    return new Cardinal(context, tension);
  }

  cardinal.tension = function(tension) {
    return custom(+tension);
  };

  return cardinal;
})(0);
