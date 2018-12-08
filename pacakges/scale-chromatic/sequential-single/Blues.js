import colors from "../colors";
import ramp from "../ramp";

//单彩颜色方案生成器

//注意concat函数中每个参数都会构成最终数组的元素
//下面的输出结构为具有7个元素的数组，而每个元素又是一系列颜色值构成的数组
export var scheme = new Array(3)
  .concat(
    "deebf79ecae13182bd",
    "eff3ffbdd7e76baed62171b5",
    "eff3ffbdd7e76baed63182bd08519c",
    "eff3ffc6dbef9ecae16baed63182bd08519c",
    "eff3ffc6dbef9ecae16baed64292c62171b5084594",
    "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594",
    "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b"
  )
  .map(colors);

export default ramp(scheme);
