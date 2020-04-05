import defaultSource from "./defaultSource";

export default (function sourceRandomIrwinHall(source) {

  // irwin-hall分布，下面是其数学定义
  function randomIrwinHall(n) {
    return function() {
      for (var sum = 0, i = 0; i < n; ++i) {
        sum += source();
      }
      return sum;
    };
  }

  randomIrwinHall.source = sourceRandomIrwinHall;

  return randomIrwinHall;
})(defaultSource);
