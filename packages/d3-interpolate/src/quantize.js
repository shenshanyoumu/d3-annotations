/**
 * 
 * @param {*} interpolator 外部传递的插值函数
 * @param {*} n 量子化的样本容量
 */
export default function(interpolator, n) {
  var samples = new Array(n);
  for (var i = 0; i < n; ++i) 
    samples[i] = interpolator(i / (n - 1));
  return samples;
}
