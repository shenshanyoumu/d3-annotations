function Step(context, t) {
  this._context = context;
  this._t = t;
}

// 形成阶梯形状的图元generator，
Step.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (0 < this._t && this._t < 1 && this._point === 2) 
      this._context.lineTo(this._x, this._y);

    if (this._line || (this._line !== 0 && this._point === 1)) 
      this._context.closePath();

    if (this._line >= 0) 
      this._t = 1 - this._t, this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; 
      this._line ? this._context.lineTo(x, y) : 
      this._context.moveTo(x, y); break;

      case 1: this._point = 2; // proceed
      default: {
        if (this._t <= 0) {
          // 在_x处直接开始阶梯上折
          this._context.lineTo(this._x, y);
          this._context.lineTo(x, y);
        } else {

          // 当_t>0，则表示在[_x,x]的_t分位点开始进行阶梯上折
          var x1 = this._x * (1 - this._t) + x * this._t;
          this._context.lineTo(x1, this._y);
          this._context.lineTo(x1, y);
        }
        break;
      }
    }

    // 内部保持最近加入的坐标点，因为绘制过程上下文无关性和无后效性
    this._x = x, this._y = y;
  }
};

// 默认情况下在[_x,x]中点处开始阶梯上折绘制
export default function(context) {
  return new Step(context, 0.5);
}

// 直接在_x处进行阶梯上折绘制
export function stepBefore(context) {
  return new Step(context, 0);
}

// 先绘制从[_x,_y]到[x,_y]，然后在[x,_y]进行阶梯上折
export function stepAfter(context) {
  return new Step(context, 1);
}
