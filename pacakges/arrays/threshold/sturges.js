// Sturges公式衍生自二项分布
// 并假设参数values符合正态分布，对其他分布无法处理
export default function(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
}
