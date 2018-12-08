import { interpolateRgbBasis } from "d3-interpolate";

/**
 * 返回颜色方案数组中最后一个颜色方案的基础插值器
 * @param {*} scheme 一系列颜色方案构成的数组，其中每个颜色方案本身由一系列颜色值构成
 */
export default function(scheme) {
  return interpolateRgbBasis(scheme[scheme.length - 1]);
}
