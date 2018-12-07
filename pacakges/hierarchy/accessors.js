// 节点访问器，具有可选状态和必须状态
export function optional(f) {
  return f == null ? null : required(f);
}

export function required(f) {
  if (typeof f !== "function") throw new Error();
  return f;
}
