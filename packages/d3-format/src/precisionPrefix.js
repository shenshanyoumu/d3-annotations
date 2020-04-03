import exponent from "./exponent.js";

// step表示精度范围，比如1.0e5
// value参数决定使用的SI国际单位制前缀，比如value为1.3e6则国际单位制使用"M"前缀
export default function(step, value) {
  return Math.max(0, 
    Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 
    - exponent(Math.abs(step)));
}
