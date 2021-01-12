/**
 * 原型链继承
 * @param {*} constructor 构造函数，在JS中凡是被new调用的函数都可以称为构造函数
 * @param {*} factory 工厂函数，就是能够输出特定对象的函数，一般在该函数内部使用new来创建对象
 * @param {*} prototype 用于属性共享的原型机制
 */
export default function(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

/**
 * 基于Object.create方式的继承模式
 * @param {*} parent 
 * @param {*} definition 
 */
export function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);

  for (var key in definition) {
    prototype[key] = definition[key];
  }

  return prototype;
}
