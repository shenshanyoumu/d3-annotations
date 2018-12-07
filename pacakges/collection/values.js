// 提取Map结构的value保存
export default function(map) {
  var values = [];
  for (var key in map) {
    values.push(map[key]);
  }
  return values;
}
