import {pair} from "./pairs";

/**
 * 计算两个数组的叉积
 * @param {*} values0 
 * @param {*} values1 
 * @param {*} reduce 
 */
export default function(values0, values1, reduce) {
  var n0 = values0.length,
      n1 = values1.length,
      values = new Array(n0 * n1),
      i0,
      i1,
      i,
      value0;

  /** 将两个数组各取元素进行组合 */
  if (reduce == null) reduce = pair;

  /** reduce函数默认为配对函数，当然还有其他叉积形式 */
  for (i0 = i = 0; i0 < n0; ++i0) {
    for (value0 = values0[i0], i1 = 0; i1 < n1; ++i1, ++i) {
      values[i] = reduce(value0, values1[i1]);
    }
  }

  return values;
}
