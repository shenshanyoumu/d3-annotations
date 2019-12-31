/**
 * 原型链继承
 * @param {*} constructor 
 * @param {*} factory 
 * @param {*} prototype 
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
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}
