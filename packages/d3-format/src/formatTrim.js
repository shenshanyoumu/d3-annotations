// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
// 注意对于1.200001K这种有效位转换后还是原值
export default function(s) {

  // 注意out: 与switch中out配对，实现类似C语言中的goto功能
  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {

    // 
    switch (s[i]) {
      // 数值字符串如果存在小数部分，则先定位到小数点符号索引。
      // 这一步用于引导后续小数部分有效数的限定
      case ".": i0 = i1 = i; break;

      // 对于字符串整数部分的前缀0，由于i0=-1，因此不用处理
      // 对于小数部分出现的0，则分两种情况
      // a、从小数位开始出现0，则不用处理
      // b、非0数字字符后面的0，则不断更新非0数字后面第一个0
      case "0": if (i0 === 0){
        i0 = i; i1 = i; break;
      }

      // 注意+s[i]表示转换为数值型，对于非数符号比如"k"则转为NaN
      // 当包含小数部分的数值字符串遍历到小数部分
      default: if (i0 > 0) {
         // s[i]前面一位为0，并且当前s[i]为0或者"K"，则继续for循环
        //  注意此时i0值>0
         if (!+s[i]) break out;
        
        // 当数字字符串小数部分出现非0字符，则更新i0索引值
        i0 = 0; 
      } break;
    }
  }

  // 注意数值字符串前导0都算有效数字，i0记录小数部分非0字符后第一个0的位置；
  // i1在整个计算过程中一直作为i0的sentinel，只有当遍历到字符串最后时两者出现差异

  // JS知识点：slice(start?,end?)其中不包含end索引
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}
