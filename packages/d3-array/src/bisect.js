import ascending from "./ascending";
import bisector from "./bisector";

/**
 * 注意二分查找的数组一定有序，并且根据上下文可推论
 * 二分数组升序
 */
var ascendingBisect = bisector(ascending);
export var bisectRight = ascendingBisect.right;
export var bisectLeft = ascendingBisect.left;
export default bisectRight;
