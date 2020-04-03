// 将包含数字字符的参数value，根据替换规则返回新的字符串
export default function(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}
