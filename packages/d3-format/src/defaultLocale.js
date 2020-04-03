import formatLocale from "./locale.js";

var locale;
export var format;
export var formatPrefix;

defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  minus: "-"
});

export default function defaultLocale(definition) {
  locale = formatLocale(definition);
  format = locale.format;

  // 基于SI国际单位制的量纲前缀串
  formatPrefix = locale.formatPrefix;
  return locale;
}
