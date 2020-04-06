import {select} from "d3-selection";
import noevent from "./noevent.js";

export default function(view) {
  var root = view.document.documentElement,
      // 注意"dragstart.drag"会被dispatch拆解为eventType为"dragstart"
      // eventName为"drag"
      selection = select(view).on("dragstart.drag", noevent, true);

    
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, true);
  } else {
    // 为了防止HTML文本被选择，需要设置。不然拖拽行为和选择行为可能有冲突
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

export function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", null);
    
  // 
  if (noclick) {
    selection.on("click.drag", noevent, true);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}
