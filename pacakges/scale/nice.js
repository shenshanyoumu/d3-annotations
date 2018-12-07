// 一些图表的值域可能需要扩展从而值域的起点/终点落在舍入的规整值上，因此下面的方法就是用于修改比例尺的值域
export default function(domain, interval) {
  domain = domain.slice();

  var i0 = 0,
    i1 = domain.length - 1,
    x0 = domain[i0],
    x1 = domain[i1],
    t;

  if (x1 < x0) {
    (t = i0), (i0 = i1), (i1 = t);
    (t = x0), (x0 = x1), (x1 = t);
  }

  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
}