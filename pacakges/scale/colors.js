// 将字符串中的颜色信息映射为CSS形式的表示
export default function(s) {
  return s.match(/.{6}/g).map(function(x) {
    return "#" + x;
  });
}
