export default function(_) {

  // 注意d3中很多链式调用操作，即每次调用用返回this对象。下面逻辑为将当前四叉树扩展到给定的范围
  // 如果给定范围属于当前四叉树的子区域，则直接返回当前四叉树
  return arguments.length
      ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
      : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
}
