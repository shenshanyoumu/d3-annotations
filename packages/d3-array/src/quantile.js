import number from "./number";

/**
 * 
 * @param {*} values 有序数组
 * @param {*} p 分位点
 * @param {*} valueof 将values中元素映射到数值型空间
 */
export default function(values, p, valueof) {
  if (valueof == null) valueof = number;
  if (!(n = values.length)) return;

  /** 0分位点和1分位点的特殊处理 */
  if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);

  /** 根据数组容量和分位点特征，导致分位点并不一定定位到数组某个元素，因此需要向下取整逻辑 */
  var n,
      i = (n - 1) * p,
      i0 = Math.floor(i),
      value0 = +valueof(values[i0], i0, values),
      value1 = +valueof(values[i0 + 1], i0 + 1, values);

  /** 严格求解分位点的数值。如果分位点落在索引(i,j)之间，则需要计算准确的分位数 */
  return value0 + (value1 - value0) * (i - i0);
}
