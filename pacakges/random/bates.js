import defaultSource from "./defaultSource";
import irwinHall from "./irwinHall";

export default (function sourceRandomBates(source) {
  // 贝茨分布生成器
  function randomBates(n) {
    var randomIrwinHall = irwinHall.source(source)(n);
    return function() {
      return randomIrwinHall() / n;
    };
  }

  randomBates.source = sourceRandomBates;

  return randomBates;
})(defaultSource);
