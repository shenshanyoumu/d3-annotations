
/**
 * 有孔环状结构，其中hole结构的点顺序与ring结构的点顺序相反
 * @param {*} ring 
 * @param {*} hole 
 */
export default function(ring, hole) {
  var i = -1, n = hole.length, c;
  while (++i < n) if (c = ringContains(ring, hole[i])) return c;
  return 0;
}

/**
 * 判断给定点point 是否在环状结构ring上。
 * @param {*} ring 
 * @param {*} point 
 */
function ringContains(ring, point) {
  var x = point[0], y = point[1], contains = -1;

  /** 注意下面的迭代，限制了索引i和索引j是邻接点 */
  for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
    var pi = ring[i], xi = pi[0], yi = pi[1], pj = ring[j], xj = pj[0], yj = pj[1];
    /** 表示点point不在环上，而在pi和pj构成的线段中 */
    if (segmentContains(pi, pj, point)) return 0;

    /** 
     * 注意下面第一个条件表示点point的Y分量在yi和yj之间；
     * 而第二个条件表示两组斜率大小，表示点point位于pi和pj为端点的弦状区域内部
     * */
    if (((yi > y) !== (yj > y)) && ((x < (xj - xi) * (y - yi) / (yj - yi) + xi))) 
      contains = -contains;
  }
  /** contains的值分为0，-1和1。其中符合循环体第一个If判定为0，否则可能在-1和1之间来回变换 */
  return contains;
}

/**
 * 判定点c是否在线段[a,b]上
 * @param {*} a 
 * @param {*} b 
 * @param {*} c 
 */
function segmentContains(a, b, c) {
  /** 注意+(a[0]===b[0])可将布尔值转化为{0,1}二元取值,within判定三个坐标点分量大小 */
  var i; return collinear(a, b, c) && within(a[i = +(a[0] === b[0])], c[i], b[i]);
}

/**
 * 三点共线判定，本质上计算(a,b)和(b,c)的斜率
 * @param {*} a 
 * @param {*} b 
 * @param {*} c 
 */
function collinear(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) === (c[0] - a[0]) * (b[1] - a[1]);
}

/** 判定数值q是否在(p,r)之间*/
function within(p, q, r) {
  return p <= q && q <= r || r <= q && q <= p;
}
