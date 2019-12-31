import number from "./number";

/**
 * 随机变量数组求解方差
 * @param {*} values 样本集合
 * @param {*} valueof 可选的求值函数，用于将样本空间从非数值型转化到数值型
 */
export default function(values, valueof) {
  var n = values.length,
      m = 0,
      i = -1,
      mean = 0, //平均值
      value,
      delta, //样本当前随机变量与之前样本平均值的幅度量
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number(values[i]))) {

        /**
         * 平滑均值的巧妙算法，
         */
        delta = value - mean; 
        mean += delta / ++m;

        /** 
         * 求解振幅平方和的计算过程
         */
        sum += delta * (value - mean);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number(valueof(values[i], i, values)))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  /** 
   * 求解随机变量方差
   */
  if (m > 1) return sum / (m - 1);
}
