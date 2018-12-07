// 多边形生成器
export default class Polygon {
  constructor() {
    this._ = [];
  }
  moveTo(x, y) {
    this._.push([x, y]);
  }
  closePath() {
    this._.push(this._[0].slice());
  }
  lineTo(x, y) {
    this._.push([x, y]);
  }

  // 获得构成多边形的顶点集合
  value() {
    return this._.length ? this._ : null;
  }
}
