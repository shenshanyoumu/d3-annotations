import defaultView from "../window";

// 给定的DOM节点分发特定类型的事件
function dispatchEvent(node, type, params) {
  var window = defaultView(node),
    event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params)
      event.initEvent(type, params.bubbles, params.cancelable),
        (event.detail = params.detail);
    else event.initEvent(type, false, false);
  }

  // 这是DOM规范的定义的方法，用于DOM节点分发事件
  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

export default function(type, params) {
  return this.each(
    (typeof params === "function" ? dispatchFunction : dispatchConstant)(
      type,
      params
    )
  );
}
