// 提取Map的keys，注意这里的map其实就是扩展了方法的Object
export default function(map) {
  var keys = [];
  for (var key in map) keys.push(key);
  return keys;
}
