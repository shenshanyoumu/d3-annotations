/**
 * 如果函数没有参数，则说明未定义定义域和值域；
 * 如果只有一个参数，则先定义值域
 * @param {*} domain 定义域数组
 * @param {*} range 值域数组
 * 必须先初始化值域！
 */
export function initRange(domain, range) {
  switch (arguments.length) {
    case 0: break;
    case 1: this.range(domain); break;
    default: this.range(range).domain(domain); break;
  }
  return this;
}

// interpolator插值函数，如果只有一个参数，则使用scale默认的插值器
// 对定义域的插值处理
export function initInterpolator(domain, interpolator) {
  switch (arguments.length) {
    case 0: break;
    case 1: this.interpolator(domain); break;
    default: this.interpolator(interpolator).domain(domain); break;
  }
  return this;
}
