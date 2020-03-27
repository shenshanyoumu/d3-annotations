import {hue} from "./color.js";

/**
 * 颜色空间色调插值
 * @param {*} a 
 * @param {*} b 
 */
export default function(a, b) {
  var i = hue(+a, +b);
  return function(t) {
    var x = i(t);
    return x - 360 * Math.floor(x / 360);
  };
}
