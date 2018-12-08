import { map } from "../array";
import ascending from "../ascending";
import number from "../number";
import quantile from "../quantile";

// 将Scott规范函数中的3.5σ规则替换为 2 IQR。所谓IQR等价interquartile range
// 对直方图中异常数据的敏感度比标准差要低

//  在统计学中，Freedman-Diaconis规则用于在直方图中计算每个bin的大小。
export default function(values, min, max) {
  values = map.call(values, number).sort(ascending);

  // 下面的0.75-0.25的分位区间，比单纯的中位数要精确多
  return Math.ceil(
    (max - min) /
      (2 *
        (quantile(values, 0.75) - quantile(values, 0.25)) *
        Math.pow(values.length, -1 / 3))
  );
}
