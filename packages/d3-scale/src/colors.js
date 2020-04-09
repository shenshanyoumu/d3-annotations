// 对6位十六进制的颜色字符串，转换为符合CSS规范带"#"前缀的字符串
export default function(s) {
  return s.match(/.{6}/g).map(function(x) {
    return "#" + x;
  });
}
