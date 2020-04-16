// 对选择集DOM对象的变换形式。参数k在scale中表示缩放因子；
// 在translate表示平移因子
export function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}

Transform.prototype = {
  constructor: Transform,

  // 
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },

  // 作图分析，可知当前this位置在向量point的作用下发生的位移变化。
  // apply变换可以构造出平移、缩放、旋转三种变换。当point与原点形成的向量与this变换坐标构成的向量共线
  // 则形成缩放变换，当两个向量不共线则可以形成旋转变换
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },

  // 按照坐标分量的平移过程
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },

  // apply的逆运算，即知道原坐标经过坐标变换后的新坐标计算变换向量point
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  // 计算变换前的X分量坐标，参数x为变换后的坐标X轴分量
  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },

  // 参数x是一个scale对象，注意下面this.invertx表示根据当前坐标点计算坐标变换前的坐标位置；
  // 而后面x.invert是scale中从值域到定义域的逆运算。下面操作目的是发生zoom操作后重新计算定义域变化
  // 从而需要重新进行scale关系映射
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },

  // 转换为绘制命令字符串，下面的字符串可以在DOM规范下执行
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};

export var identity = new Transform(1, 0, 0);

transform.prototype = Transform.prototype;

export default function transform(node) {
  while (!node.__zoom) if (!(node = node.parentNode)) return identity;
  return node.__zoom;
}
