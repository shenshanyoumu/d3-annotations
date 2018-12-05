/**
 * 返回一个函数，该函数接收真实的value字符串。value字符串中匹配阿拉伯数字，并替换为语言环境下的数字字典
 * @param {*} numerals 各种语言环境下表示数字的字典，一般都是经过转义后的字符形式
 */
export default function(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}
