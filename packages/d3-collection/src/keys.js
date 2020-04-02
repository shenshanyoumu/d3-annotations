// Map对象及其原型链式所有可枚举属性都会被遍历到，包括属性方法
// 因此下面参数map参数应该不是Map对象，不然keys数组包含太多其他类型的属性
export default function(map) {
  var keys = [];
  for (var key in map) keys.push(key);
  return keys;
}
