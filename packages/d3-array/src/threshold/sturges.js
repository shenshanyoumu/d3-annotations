/** Math.LN2表示以自然数e为底指数为2的对象 */
export default function(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
}
