import treemapDice from "./dice.js";
import treemapSlice from "./slice.js";

// 这是黄金分割比例0.618的倒数
export var phi = (1 + Math.sqrt(5)) / 2;

// ratio表示对矩形的分割点设定，比如将矩形按照黄金分割点分为两部分
// parent表示父节点对象，后面为父节点所占的矩形区域
export function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
  var rows = [],
      nodes = parent.children,
      row,
      nodeValue,
      i0 = 0,
      i1 = 0,
      n = nodes.length,
      dx, dy,

      // 父节点value值，用于辅助子节点value到几何空间的划分
      value = parent.value,
      sumValue,
      minValue,
      maxValue,
      newRatio,
      minRatio,
      alpha,
      beta;

  while (i0 < n) {

    // 第一轮先根据parent节点的空间区域，计算矩形宽高值
    dx = x1 - x0, dy = y1 - y0;

    // nodes表示parent的孩子节点，
    // 不断遍历直到出现第一个value不为0的孩子节点。孩子节点value为0
    // 实际上并不占任何空间
    do sumValue = nodes[i1++].value; 
    while (!sumValue && i1 < n);

    minValue = maxValue = sumValue;

    // Math.max(dy/dx,dx/dy)计算宽长比或者长宽比的较大值
    // todo:下面三行代码不能理解?
    alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
    beta = sumValue * sumValue * alpha;
    minRatio = Math.max(maxValue / beta, beta / minValue);

    // Keep adding nodes while the aspect ratio maintains
    //  or improves.
    for (; i1 < n; ++i1) {
      // sumValue从第一个孩子开始累加value值
      sumValue += nodeValue = nodes[i1].value;

      // 记录孩子节点中value最大最小值
      if (nodeValue < minValue) minValue = nodeValue;
      if (nodeValue > maxValue) maxValue = nodeValue;

      // 不断调整待分割的矩形的宽长比例
      beta = sumValue * sumValue * alpha;
      newRatio = Math.max(maxValue / beta, beta / minValue);
      if (newRatio > minRatio) { 
        sumValue -= nodeValue; 
        break; }
        minRatio = newRatio;
    }

    // Position and record the row orientation.
    // 注意下面dice:dx<dy，用于判定当前节点的矩形区域宽高大小关系
    // 如果当前矩形宽大于高，则按照垂直方向切割矩形的宽度；
    // 反之水平方向切割矩形的高度
    rows.push(row = {
      value: sumValue, dice: dx < dy, 
      children: nodes.slice(i0, i1)
    });

    // 
    if (row.dice) 
      treemapDice(row, x0, y0, x1, value ?
         y0 += dy * sumValue / value : y1);

    else treemapSlice(row, x0, y0, value ?
       x0 += dx * sumValue / value : x1, y1);
    
    // 当parent节点包含的整个区域，分割出一部分给某个孩子节点后
    // 剩余空间会在下一轮循环中再次进行切分
    value -= sumValue, i0 = i1;
  }

  return rows;
}

export default (function custom(ratio) {

  function squarify(parent, x0, y0, x1, y1) {
    squarifyRatio(ratio, parent, x0, y0, x1, y1);
  }

  // 注意下面这种JS的编写形态，表示当调用ratio函数后，整个squarify操作会重新计算
  // 需要区分与闭包的差异
  squarify.ratio = function(x) {
    return custom((x = +x) > 1 ? x : 1);
  };

  return squarify;
})(phi);
