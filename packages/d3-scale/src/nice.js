// interval函数对象，反映一个小区间的变换处理
export default function(domain, interval) {
  domain = domain.slice();

  var i0 = 0,
      i1 = domain.length - 1,

      //定义域的上下界
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  // 确保定义域区间升序
  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }
  
  // 为了坐标轴显示美化，将定义域端点进行处理
  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
}
