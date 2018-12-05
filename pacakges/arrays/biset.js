import ascending from "./ascending";
import bisector from "./bisector";

// 二分查找器的精妙实现，基于一个内置的比较器来进行查找处理
var ascendingBisect = bisector(ascending);
export var bisectRight = ascendingBisect.right;
export var bisectLeft = ascendingBisect.left;
export default bisectRight;
