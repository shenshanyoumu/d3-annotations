import defaultSource from "./defaultSource";

export default (function sourceRandomIrwinHall(source) {
  // 欧文霍尔分布 生成器
  function randomIrwinHall(n) {
    return function() {
      for (var sum = 0, i = 0; i < n; ++i) sum += source();
      return sum;
    };
  }

  randomIrwinHall.source = sourceRandomIrwinHall;

  return randomIrwinHall;
})(defaultSource);
