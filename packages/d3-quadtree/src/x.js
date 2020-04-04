// 坐标X分量
export function defaultX(d) {
  return d[0];
}

export default function(_) {
  return arguments.length ? (this._x = _, this) : this._x;
}
