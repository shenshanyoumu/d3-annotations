import selection_select from "./select";
import selection_selectAll from "./selectAll";
import selection_filter from "./filter";
import selection_data from "./data";
import selection_enter from "./enter";
import selection_exit from "./exit";
import selection_join from "./join";
import selection_merge from "./merge";
import selection_order from "./order";
import selection_sort from "./sort";
import selection_call from "./call";
import selection_nodes from "./nodes";
import selection_node from "./node";
import selection_size from "./size";
import selection_empty from "./empty";
import selection_each from "./each";
import selection_attr from "./attr";
import selection_style from "./style";
import selection_property from "./property";
import selection_classed from "./classed";
import selection_text from "./text";
import selection_html from "./html";
import selection_raise from "./raise";
import selection_lower from "./lower";
import selection_append from "./append";
import selection_insert from "./insert";
import selection_remove from "./remove";
import selection_clone from "./clone";
import selection_datum from "./datum";
import selection_on from "./on";
import selection_dispatch from "./dispatch";

export var root = [null];

/** 
 * 第一个参数表示选择集分组，在实际应用中可以同时选择SVG节点下多个分组
 */
export function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

/** 构建的selection可以选择当前document所有DOM节点。 */
function selection() {
  return new Selection([[document.documentElement]], root);
}

/** D3-Selection模块暴露的方法 */
Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data, //核心方法，用于绑定数据
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,

  // 绑定context，比如处理事件等
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum, //核心方法
  on: selection_on,
  dispatch: selection_dispatch //在所选则的DOM集合上施加事件分发能力
};

export default selection;
