import { Transition } from "./transition/index";
import { SCHEDULED } from "./transition/schedule";

var root = [null];

/**
 *
 * @param {*} node 选择的DOM节点
 * @param {*} name 渐变动画名称
 */
export default function(node, name) {
  // 一个DOM节点可能同时参与多个渐变动画
  var schedules = node.__transition,
    schedule,
    i;

  if (schedules) {
    name = name == null ? null : name + "";

    // 如果给定的渐变动画等待调度执行，则创建一个新的渐变执行过程
    for (i in schedules) {
      if (
        (schedule = schedules[i]).state > SCHEDULED &&
        schedule.name === name
      ) {
        return new Transition([[node]], root, name, +i);
      }
    }
  }

  return null;
}
