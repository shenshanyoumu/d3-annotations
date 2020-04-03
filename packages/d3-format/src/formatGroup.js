/**
 * 
 * @param {*} grouping 对数值进行分组的组距列表，比如三个数字为一组
 * @param {*} thousands 数值分位符号，与比如","逗号分隔
 */
export default function(grouping, thousands) {

  // value表示待格式处理的数值参数，width表示格式位数，超过部分丢弃
  return function(value, width) {
    var i = value.length,
        t = [],
        j = 0,

        // 第一个分组组距
        g = grouping[0],
        length = 0;

    // 
    while (i > 0 && g > 0) {
      // 当已有分组总长度和当前待分组长度之和大于格式宽度，则修改最后一个分组组距
      if (length + g + 1 > width){
        g = Math.max(1, width - length);
      }

      // 参数value按照分组组距进行切割
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;

      // 如果分组grouping存在多个元素，这个应用场景在哪儿？
      // 目前来说，都是固定为组距3
      g = grouping[j = (j + 1) % grouping.length];
    }

    // 反转后才能对正确对参数value的数位进行分组和符号连接
    return t.reverse().join(thousands);
  };
}
