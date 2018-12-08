import colors from "../colors";
import ramp from "../ramp";

//多彩形式的颜色方案生成器

//注意concat函数中每个参数都会构成最终数组的元素
//下面的输出结构为具有7个元素的数组，而每个元素又是一系列颜色值构成的数组
export var scheme = new Array(3)
  .concat(
    "e5f5f999d8c92ca25f",
    "edf8fbb2e2e266c2a4238b45",
    "edf8fbb2e2e266c2a42ca25f006d2c",
    "edf8fbccece699d8c966c2a42ca25f006d2c",
    "edf8fbccece699d8c966c2a441ae76238b45005824",
    "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824",
    "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b"
  )
  .map(colors);

export default ramp(scheme);
