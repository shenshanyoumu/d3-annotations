// Sturges公式衍生自二项分布
// 并假设参数values符合正态分布，对其他分布无法处理

/**
 * 返回sturges组距生成器，组距分组是将全部变量值划分为若干个区间，并将这一区间的变量值作为一组
 * @param {*} values 分类数组
 */
export default function(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
}
