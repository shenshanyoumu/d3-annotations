/**
 * 
 * @param {*} target 触发事件的目标对象
 * @param {*} type 事件对象类型
 * @param {*} selection 绑定d3-selection对象，提供基于DOM的各种能力
 */
export default function(target, type, selection) {
  this.target = target;
  this.type = type;
  this.selection = selection;
}
