import enclose from "./enclose.js";

// 在二维空间上放置三个圆，使得作图效果上更加紧凑和美化
// 即让三个圆两两外切
function place(b, a, c) {
  var dx = b.x - a.x, x, a2,
      dy = b.y - a.y, y, b2,

      // a\b圆心距的平方
      d2 = dx * dx + dy * dy;
  if (d2) {
    a2 = a.r + c.r, a2 *= a2;
    b2 = b.r + c.r, b2 *= b2;
    if (a2 > b2) {
      x = (d2 + b2 - a2) / (2 * d2);
      y = Math.sqrt(Math.max(0, b2 / d2 - x * x));
      c.x = b.x - x * dx - y * dy;
      c.y = b.y - x * dy + y * dx;
    } else {
      x = (d2 + a2 - b2) / (2 * d2);
      y = Math.sqrt(Math.max(0, a2 / d2 - x * x));
      c.x = a.x + x * dx - y * dy;
      c.y = a.y + x * dy + y * dx;
    }
  } else {
    // 如果a\b同心圆，则向圆a右边c.r半径位置放置圆c，从而三个圆水平一致
    c.x = a.x + c.r;
    c.y = a.y;
  }
}

// 如果两个圆半径之和大于圆心距，则说明两个圆不相离。即可能是相交或者包含
function intersects(a, b) {
  var dr = a.r + b.r - 1e-6, dx = b.x - a.x, dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

// 根据作图法可知，dy、dy偏向于半径较小的圆。
// 其目的在于绘图时尽量让较大的圆靠近外围圆圆弧附近，增加美化效果
function score(node) {
  var a = node._,
      b = node.next._,
      ab = a.r + b.r,
      dx = (a.x * b.r + b.x * a.r) / ab,
      dy = (a.y * b.r + b.y * a.r) / ab;
  return dx * dx + dy * dy;
}

// 同层级上兄弟节点的前后关系
function Node(circle) {
  this._ = circle;
  this.next = null;
  this.previous = null;
}

export function packEnclose(circles) {

  // 如果没有任何圆，则直接返回
  if (!(n = circles.length)) return 0;

  var a, b, c, n, aa, ca, i, j, k, sj, sk;

  // 修改第一个圆的坐标点，在绘制时将该圆绘制到坐标原点。
  // 如果只有一个圆，则返回圆a在X轴右边交点
  a = circles[0], a.x = 0, a.y = 0;
  if (!(n > 1)) return a.r;

  // 注意下面的代码，作用是将圆a、圆b在X轴外切排列。其中圆a在X轴左边
  // 如果只有两个圆，则返回最右边的圆b在X轴右边交点
  b = circles[1], a.x = -b.r, b.x = a.r, b.y = 0;
  if (!(n > 2)) return a.r + b.r;

  // 三个圆相互外切
  place(b, a, c = circles[2]);

  // 三个圆处于同一级，则通过指针设置兄弟节点关系
  a = new Node(a), b = new Node(b), c = new Node(c);
  a.next = c.previous = b;
  b.next = a.previous = c;
  c.next = b.previous = a;

  // Attempt to place each remaining circle…
  pack: for (i = 3; i < n; ++i) {
    // 
    place(a._, b._, c = circles[i]), c = new Node(c);

    // Find the closest intersecting circle on the front-chain, if any.
    // “Closeness” is determined by linear distance along the front-chain.
    // “Ahead” or “behind” is likewise determined by linear distance.
    j = b.next, k = a.previous, sj = b._.r, sk = a._.r;
    do {
      if (sj <= sk) {
        if (intersects(j._, c._)) {
          b = j, a.next = b, b.previous = a, --i;
          continue pack;
        }
        sj += j._.r, j = j.next;
      } else {
        if (intersects(k._, c._)) {
          a = k, a.next = b, b.previous = a, --i;
          continue pack;
        }
        sk += k._.r, k = k.previous;
      }
    } while (j !== k.next);

    // Success! Insert the new circle c between a and b.
    c.previous = a, c.next = b, a.next = b.previous = b = c;

    // Compute the new closest circle pair to the centroid.
    aa = score(a);
    while ((c = c.next) !== b) {
      if ((ca = score(c)) < aa) {
        a = c, aa = ca;
      }
    }
    b = a.next;
  }

  // Compute the enclosing circle of the front chain.
  a = [b._], c = b; while ((c = c.next) !== b) a.push(c._); c = enclose(a);

  // Translate the circles to put the enclosing circle around the origin.
  for (i = 0; i < n; ++i) a = circles[i], a.x -= c.x, a.y -= c.y;

  return c.r;
}


// circles表示最初的圆集合，注意circle元素对象包含x坐标分量、y坐标分量和圆半径参数r
// 经过包含封装后，返回具有层级结构的圆集合
export default function(circles) {
  packEnclose(circles);
  return circles;
}
