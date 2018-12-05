import formatLocale from "./locale";

var locale;
export var format;
export var formatPrefix;

// 在各种语言环境下，对数字的格式化无外乎下面形式
defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

export default function defaultLocale(definition) {
  locale = formatLocale(definition);
  format = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}
