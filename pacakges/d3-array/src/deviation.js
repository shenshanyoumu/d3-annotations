import variance from "./variance";

/**
 * 标准差
 * @param {*} array 
 * @param {*} f 
 */
export default function(array, f) {
  var v = variance(array, f);
  return v ? Math.sqrt(v) : v;
}
