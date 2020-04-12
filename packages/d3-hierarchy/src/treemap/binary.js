
// 对parent的空间进行二分划分，注意随着子矩形的宽高大小变化，需要调整切分的方向
// 如果矩形宽大于高，则二分切割宽；反之则切割高
export default function(parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      i, n = nodes.length,
      sum, sums = new Array(n + 1);

      // sum表示所有孩子节点的value和；
      // sums是累加形式的子节点及其前面兄弟节点的value和
  for (sums[0] = sum = i = 0; i < n; ++i) {
    sums[i + 1] = sum += nodes[i].value;
  }

  // n表示孩子节点数目，[[x0,y0],[x1,y1]]是父节点空间范围
  partition(0, n, parent.value, x0, y0, x1, y1);

  function partition(i, j, value, x0, y0, x1, y1) {

    // 如果只剩下最后一个孩子节点，则空间坐标直接赋值
    if (i >= j - 1) {
      var node = nodes[i];
      node.x0 = x0, node.y0 = y0;
      node.x1 = x1, node.y1 = y1;
      return;
    }

    // sums是一种孩子节点value的累加数组
    var valueOffset = sums[i],
        valueTarget = (value / 2) + valueOffset,
        k = i + 1,
        hi = j - 1;

    // 二分查找，找到sums数组中累进和等于valueTarget的索引
    while (k < hi) {
      var mid = (k + hi)>>> 1;
      if (sums[mid] < valueTarget) k = mid + 1;
      else hi = mid;
    }

    // 如果累进sums没有与valueTarget一致的元素值，则找到最近一个元素的索引
    if ((valueTarget - sums[k - 1]) < (sums[k] - valueTarget) && i + 1 < k)
     --k;


    //  下面代码的含义，需要记住几何空间与数值空间的映射关系
    // 针对root.value则占据整个矩形空间，而子节点根据value的总占比来划分空间
    var valueLeft = sums[k] - valueOffset,
        valueRight = value - valueLeft;

      // 如果矩形宽大于高，则垂直方向切割矩形宽
    if ((x1 - x0) > (y1 - y0)) {
      var xk = (x0 * valueRight + x1 * valueLeft) / value;
      partition(i, k, valueLeft, x0, y0, xk, y1);
      partition(k, j, valueRight, xk, y0, x1, y1);
    } else {

      // 如果矩形高大于宽，则水平切割矩形高
      var yk = (y0 * valueRight + y1 * valueLeft) / value;
      partition(i, k, valueLeft, x0, y0, x1, yk);
      partition(k, j, valueRight, x0, yk, x1, y1);
    }
  }
}
