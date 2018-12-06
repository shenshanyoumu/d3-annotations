import defaultSource from "./defaultSource";
import normal from "./normal";

export default (function sourceRandomLogNormal(source) {
  // 对数型正太分布，即将正太分布生成器进行了自然对数处理
  function randomLogNormal() {
    var randomNormal = normal.source(source).apply(this, arguments);
    return function() {
      return Math.exp(randomNormal());
    };
  }

  randomLogNormal.source = sourceRandomLogNormal;

  return randomLogNormal;
})(defaultSource);
