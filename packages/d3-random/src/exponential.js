import defaultSource from "./defaultSource";

export default (function sourceRandomExponential(source) {

  // 指数分布，类似泊松分布
  function randomExponential(lambda) {
    return function() {
      return -Math.log(1 - source()) / lambda;
    };
  }

  randomExponential.source = sourceRandomExponential;

  return randomExponential;
})(defaultSource);
