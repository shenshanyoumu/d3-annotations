import defaultSource from "./defaultSource";
import irwinHall from "./irwinHall";

export default (function sourceRandomBates(source) {
  function randomBates(n) {
    // 根据irwinHall分布实现，下面iwrinHall.source(source)返回一个服从irwin-hall分布的随机数生成器
    var randomIrwinHall = irwinHall.source(source)(n);
    return function() {
      return randomIrwinHall() / n;
    };
  }

  randomBates.source = sourceRandomBates;

  return randomBates;
})(defaultSource);
