import {map} from "../array";
import ascending from "../ascending";
import number from "../number";
import quantile from "../quantile";

export default function(values, min, max) {
  /** 这一行代码目的是将数组中的数字串转换为数值型，并对数组升序排序 */
  values = map.call(values, number).sort(ascending);

  /** 用于计算直方图的bin个数的经验公式 */
  return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(values.length, -1 / 3)));
}
