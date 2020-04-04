// 扩展四叉树，使得覆盖给定的坐标点，最后返回调整后的四叉树
export default function(x, y) {
  // 坐标点参数异常，则直接退出
  if (isNaN(x = +x) || isNaN(y = +y)) return this; 

  // 临时保存当前四叉树左上角和右下角坐标点
  var x0 = this._x0,
      y0 = this._y0,
      x1 = this._x1,
      y1 = this._y1;


  // 当四叉树为空，则进行root节点的空间范围初始化工作
  if (isNaN(x0)) {
    x1 = (x0 = Math.floor(x)) + 1;
    y1 = (y0 = Math.floor(y)) + 1;
  }

  // Otherwise, double repeatedly to cover.
  else {

    // 当前四叉树的空间宽度值
    var z = x1 - x0,
        node = this._root,
        parent,
        i;

    // 当给定的参数[x,y]没有在当前四叉树区域内，则需要进行cover动作
    while (x0 > x || x >= x1 || y0 > y || y >= y1) {
      // bool值的位移运算，会被默认转换为数值型。true为1，false为0；
      // 数值型与布尔型的"or"运算，都会转换为数值型再进行或运算。

      // 对比参数[x,y]与当前四叉树左上角坐标点的位置关系。
      // 这是一个非常巧妙的方式
      i = (y < y0) << 1 | (x < x0);

      // 注意下面代码，类似链表生成，不同于链表不断移动尾指针来构造；
      // 四叉树通过不断扩展root节点的范围来“包裹”参数[x,y]
      // 每一轮迭代，四叉树的空间范围倍增
      parent = new Array(4), parent[i] = node, node = parent, z *= 2;

      switch (i) {
        // 表示参数[x,y]在[x0,y0]的右下方，则保持四叉树[x0,y0]位置不变，而不断扩展[x1,y1]的范围
        case 0: x1 = x0 + z, y1 = y0 + z; break;

        // 表示参数[x,y]在[x0,y0]的左下方，则需要让x0变小，并且y1增大
        case 1: x0 = x1 - z, y1 = y0 + z; break;

        // 表示参数[x,y]在[x0,y0]的右上方，则需要x1变大，并且y0变小
        case 2: x1 = x0 + z, y0 = y1 - z; break;

        // 表示参数[x,y]在[x0,y0]的左上角，则保持四叉树[x1,y1]位置不变，不断扩展[x0,y0]的范围
        case 3: x0 = x1 - z, y0 = y1 - z; break;
      }
    }

    // 非叶子节点length为4
    if (this._root && this._root.length) this._root = node;
  }

  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  return this;
}
