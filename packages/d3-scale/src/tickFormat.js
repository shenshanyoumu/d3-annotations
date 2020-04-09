import {tickStep} from "d3-array";
import {format, formatPrefix, formatSpecifier,
   precisionFixed, precisionPrefix, precisionRound
  } from "d3-format";

  // 坐标轴刻度值格式化，在图表中刻度分为数值型、文本型、时间型等
export default function(start, stop, count, specifier) {
  var step = tickStep(start, stop, count),
      precision;
  
      // specifier符合SI国际单位制，默认为浮点
  specifier = formatSpecifier(specifier == null ? 
    ",f" : specifier);

  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && 
        !isNaN(precision = precisionFixed(step))) 
        specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return format(specifier);
}
