function length(array) {
  return array.length | 0;
}

function empty(length) {
  return !(length > 0);
}

// 将类数组或者集合转换为数组形式
function arrayify(values) {
  return typeof values !== "object" || "length" in values
    ? values
    : Array.from(values);
}

// 规约求和
function reducer(reduce) {
  return values => reduce(...values);
}

// 计算两个数组的笛卡尔积,如果函数最后一个参数表示规约函数，则对笛卡尔积每个元素进行规约处理
// d3.cross([1, 2], ["x", "y"]); // returns [[1, "x"], [1, "y"], [2, "x"], [2, "y"]]
// d3.cross([1, 2], ["x", "y"], (a, b) => a + b); // returns ["1x", "1y", "2x", "2y"]
export default function cross(...values) {
  const reduce =
    typeof values[values.length - 1] === "function" && reducer(values.pop());

  // 对外部参数列表中每个元素进行数组化处理
  values = values.map(arrayify);

  // 计算数组化处理后每个元素的长度
  const lengths = values.map(length);
  const j = values.length - 1;
  const index = new Array(j + 1).fill(0);
  const product = [];

  // 进行笛卡尔积的所有数组元素都不能为空
  if (j < 0 || lengths.some(empty)) return product;

  // 下面这两个循环体内的代码太精妙精髓，用于处理多个数组的笛卡尔积运算
  while (true) {
    product.push(index.map((j, i) => values[i][j]));
    let i = j;
    while (++index[i] === lengths[i]) {
      if (i === 0) return reduce ? product.map(reduce) : product;
      index[i--] = 0;
    }
  }
}
