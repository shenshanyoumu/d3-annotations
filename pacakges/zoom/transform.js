/**
 *
 * @param {*} k 缩放因子，用于控制比例尺变化
 * @param {*} x
 * @param {*} y
 */
export function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}

Transform.prototype = {
  constructor: Transform,

  // 缩放函数，参数为系数因子
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },

  // 平移
  translate: function(x, y) {
    return (x === 0) & (y === 0)
      ? this
      : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  //
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },

  // 非常关键的函数，用于在缩放/平移操作时动态调整定义域/值域的映射关系
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },

  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },

  // 在缩放过程中，重新计算值域
  rescaleX: function(x) {
    return x.copy().domain(
      x
        .range()
        .map(this.invertX, this)
        .map(x.invert, x)
    );
  },
  rescaleY: function(y) {
    return y.copy().domain(
      y
        .range()
        .map(this.invertY, this)
        .map(y.invert, y)
    );
  },

  // 由于d3-zoom模块定义缩放和平移，因此可以输出下面字符串作为CSS的transform属性
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};

export var identity = new Transform(1, 0, 0);

transform.prototype = Transform.prototype;

export default function transform(node) {
  return node.__zoom || identity;
}
