import defaultSource from "./defaultSource";

export default (function sourceRandomUniform(source) {

  // 均匀分布需要定义[min,max]取值区间
  function randomUniform(min, max) {
    min = min == null ? 0 : +min;
    max = max == null ? 1 : +max;
    if (arguments.length === 1) max = min, min = 0;
    else max -= min;
    return function() {
      return source() * max + min;
    };
  }

  randomUniform.source = sourceRandomUniform;

  return randomUniform;
})(defaultSource);
