// 为了便于人类阅读，将大数字翻译为1,234,455这种形式表述。
export default function(grouping, thousands) {
  return function(value, width) {
    var i = value.length,
      t = [],
      j = 0,
      g = grouping[0], //世界上绝大多数语言环境中值为3
      length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) {
        g = Math.max(1, width - length);
      }

      // 从给定数字串的前方往后截取
      t.push(value.substring((i -= g), i + g));
      if ((length += g + 1) > width) break;
      g = grouping[(j = (j + 1) % grouping.length)];
    }

    // thousands表示千分位字符，一般为','形式
    return t.reverse().join(thousands);
  };
}
