export function defaultY(d) {
  return d[1];
}

// 类似对象属性的set/get方法，下面函数如果参数不为空则重置坐标Y分量
export default function(_) {
  return arguments.length ? (this._y = _, this) : this._y;
}
