// 分位数插值器函数，接收一个自定义的插值器和分位N
export default function(interpolator, n) {
  var samples = new Array(n);
  for (var i = 0; i < n; ++i) {
    samples[i] = interpolator(i / (n - 1));
  }
  return samples;
}
