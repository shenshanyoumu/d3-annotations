// 参数range可以理解为一组离散数值集，在图表设计中需要将数据空间映射到图表空间，
// 这种类似函数映射的过程，其实就是定义域到值域的映射
export default function(range) {
  var n = range.length;
  return function(t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}
