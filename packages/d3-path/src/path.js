var pi = Math.PI,
    tau = 2 * pi, //圆周弧度
    epsilon = 1e-6,//精度
    tauEpsilon = tau - epsilon;

// Path表示路径类，而path表示路径对象的factory函数
//[[x0,y0],[x1,y1]]定义subPath
function Path() {
  this._x0 = this._y0 = 
  this._x1 = this._y1 = null; 
  this._ = ""; //表示绘制指令directive
}

function path() {
  return new Path;
}

Path.prototype = path.prototype = {
  constructor: Path,

  /** 默认转化为svg的move操作 */
  moveTo: function(x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },

  closePath: function() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },

  /** svg的绘制直线指令 */
  lineTo: function(x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },

  /** svg绘制二次曲线的指令 */
  quadraticCurveTo: function(x1, y1, x, y) {
    this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  /** svg绘制贝塞尔曲线 */
  bezierCurveTo: function(x1, y1, x2, y2, x, y) {
    this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },

  /**
   * 
   * @param {*} x1 圆弧开始端点坐标X分量
   * @param {*} y1 圆弧开始端点坐标Y分量
   * @param {*} x2 圆弧结束端点坐标X分量
   * @param {*} y2 圆弧结束端点坐标Y分量
   * @param {*} r 圆弧半径
   */
  arcTo: function(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;

    // 之所以引入[x0,y0]是针对圆弧绘制作为全局绘制的一部分的场景
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // 圆弧半径合法性检查
    if (r < 0) throw new Error("negative radius: " + r);

    // 如果在绘制圆弧之前，path对象没有绘制过任何路径。则直接
    // 通过M指令将绘制点移动到[x1,y1]位置
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // 如果两个点几乎出现在同一位置，则根本无法绘制弧线
    else if (!(l01_2 > epsilon));

    /** 如果[x1,y1]和Path当前绘制点[_x1,_y1]共线，则直接基于L指令绘制直线 */
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // 其他场景就是绘制圆弧操作
    else {
      var x20 = x2 - x0,
          y20 = y2 - y0,
          l21_2 = x21 * x21 + y21 * y21,
          l20_2 = x20 * x20 + y20 * y20,
          l21 = Math.sqrt(l21_2),
          l01 = Math.sqrt(l01_2),
          l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
          t01 = l / l01,
          t21 = l / l21;

      // If the start tangent is not coincident with (x0,y0), line to.
      if (Math.abs(t01 - 1) > epsilon) {
        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
      }
      
      // 基于SVG的A指令来绘制圆弧
      this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
    }
  },

  /** 绘制弧线 */
  arc: function(x, y, r, a0, a1, ccw) {
    /** 下面操作，用于将数字串转为数值型；ccw表示是否逆时针 */
    x = +x, y = +y, r = +r, ccw = !!ccw;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
      this._ += "L" + x0 + "," + y0;
    }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau + tau;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon) {
      this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
    }
  },
  // 绘制矩形
  rect: function(x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
  },

  /** 将svg绘制指令字符串形式输出,
  / * 注意该方法是对Object.prototype.toString的重写 */
  toString: function() {
    return this._;
  }
};

export default path;
