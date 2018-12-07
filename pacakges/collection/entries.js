// 将Set/Map的key和value分别保存，形成entries结构
export default function(map) {
  var entries = [];
  for (var key in map) {
    entries.push({ key: key, value: map[key] });
  }
  return entries;
}
