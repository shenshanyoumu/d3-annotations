// 数值参数x，以及格式化后的系数小数部分精度p
export default function(x, p) {

  // 如果有系数精度要求，则使用否则默认精度
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) 
    return null;
  
    var i, coefficient = x.slice(0, i);

  // 根据科学计数法，系数整数部分为个位数，然后是"."分割，因此coefficent.slice(2)表示截取系数小数部分
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    // 指数部分字符串转数值型
    +x.slice(i + 1)
  ];
}
