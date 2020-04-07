/** 类似极坐标，通过半径和旋转弧度来决定坐标点
 * 参数x表示弧度，y表示半径
 */
export default function(x, y) {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}
