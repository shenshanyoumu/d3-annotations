import ascending from "./ascending";
import bisector from "./bisector";

/**
 * 基于升序算子的二分排序器
 */
var ascendingBisect = bisector(ascending);
export var bisectRight = ascendingBisect.right;
export var bisectLeft = ascendingBisect.left;
export default bisectRight;
