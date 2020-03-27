
/** 模拟JS语言中的call调用； */
export default function() {
  var callback = arguments[0];
  arguments[0] = this;

  // null在非严格模式下为window对象；而严格模式下null或undefined
  callback.apply(null, arguments);
  return this;
}
