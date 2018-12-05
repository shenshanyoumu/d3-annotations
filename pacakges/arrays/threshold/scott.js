// 数组元素标准差生成函数
import deviation from "../deviation";

// Scott 规范化函数，作用是优化满足正太分布的随机样本，因为正太分布中大多数样本值会落在钟形区域很小范围
export default function(values, min, max) {
  return Math.ceil(
    (max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3))
  );
}
