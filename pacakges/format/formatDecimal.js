/**
 *
 * @param {*} x 表示特定的十进制数值
 * @param {*} p 表示经过指数化处理后系数的小数部分有效位数，在[0,20]之间
 *
 * formatDecimal(1.23) 返回 ["123", 0].
 */
export default function(x, p) {
  // 注意，对于小数1.23调用toExponential()返回1.23e+0形式
  if (
    (i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0
  )
    return null;
  var i,
    coefficient = x.slice(0, i);

  // 注意经过toExponential指数化的数字，其系数要么是整数要么是小数形式。
  // 对于小数形式需要去掉小数点转化为字符串
  return [
    coefficient.length > 1
      ? coefficient[0] + coefficient.slice(2)
      : coefficient,
    +x.slice(i + 1)
  ];
}
