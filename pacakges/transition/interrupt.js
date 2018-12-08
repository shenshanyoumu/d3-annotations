import { STARTING, ENDING, ENDED } from "./transition/schedule";

/**
 *  中断该DOM对象的渐变行为
 * @param {*} node DOM节点，该节点可能包含多个渐变动画
 * @param {*} name 渐变动画名称
 */
export default function(node, name) {
  var schedules = node.__transition,
    schedule,
    active,
    empty = true,
    i;

  if (!schedules) {
    return;
  }

  name = name == null ? null : name + "";

  // 该DOM节点包含多个渐变动画，需要遍历匹配待中断的动画名称
  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) {
      empty = false;
      continue;
    }

    // 表示当前渐变动画处于运行中，
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;

    // 当前渐变动画的计时器停止
    schedule.timer.stop();
    if (active) {
      // 回调监听了interrupt事件的监听器
      schedule.on.call(
        "interrupt",
        node,
        node.__data__,
        schedule.index,
        schedule.group
      );
    }
    delete schedules[i];
  }

  // 当该DOM节点只有唯一的渐变动画，并且该渐变动画与需要中断的渐变动画相同，则删除该DOM节点保存的渐变
  if (empty) {
    delete node.__transition;
  }
}
