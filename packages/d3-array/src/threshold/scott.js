import deviation from "../deviation";

/** 
 * 计算直方图bin分箱个数的经验方程
 */
export default function(values, min, max) {
  return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
}
