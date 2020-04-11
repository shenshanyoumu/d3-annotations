// 参数f必须为函数或者null
export function optional(f) {
  return f == null ? null : required(f);
}

// 用于处理必选字段，比如进行stratify时需要关键字
export function required(f) {
  if (typeof f !== "function") throw new Error;
  return f;
}
