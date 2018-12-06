import { select } from "d3-selection";
import noevent from "./noevent";

//  将元素上的拖拽事件都阻止传播，从而无法触发任何拖拽行为
export default function(view) {
  var root = view.document.documentElement,
    selection = select(view).on("dragstart.drag", noevent, true);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

export function yesdrag(view, noclick) {
  var root = view.document.documentElement,
    selection = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent, true);
    setTimeout(function() {
      selection.on("click.drag", null);
    }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}
