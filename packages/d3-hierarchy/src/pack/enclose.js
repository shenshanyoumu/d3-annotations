import {shuffle, slice} from "../array.js";

// 计算包含所有circles元素的外围圆对象
export default function(circles) {
  var i = 0, n = (circles = shuffle(slice.call(circles))).length, 
  B = [], p, e;

  while (i < n) {
    p = circles[i];
    // 如果圆e包含圆p，则继续迭代；
    // 否则让当前几个互不包含的圆扩展为一个外围圆
    if (e && enclosesWeak(e, p)) ++i;
    else e = encloseBasis(B = extendBasis(B, p)), i = 0;
  }

  return e;
}

// B为圆集合，p为另一个圆。
// 返回一个圆数组，使得该圆数组及其外围圆能够包含B和p所有元素
function extendBasis(B, p) {
  var i, j;

  if (enclosesWeakAll(p, B)) return [p];

  // If we get here then B must have at least one element.
  for (i = 0; i < B.length; ++i) {
    // 如果p不能包含B[i]圆，则用p和B[i]形成一个外围圆，并且该外围圆包含所有B中元素
    // 则返回[B[i],p]。其几何含义分为
    // 1、B[i]是最大圆且包含p
    // 2、B[i]是B中与圆p的圆心距最远的圆
    // 3、除了被p包含的圆，其他B中圆都被B[i]包含
    if (enclosesNot(p, B[i])
        && enclosesWeakAll(encloseBasis2(B[i], p), B)) {

      // B[i]、p，以及两者的外围圆可以包含所有圆
      return [B[i], p];
    }
  }

  // If we get here then B must have at least two elements.
  for (i = 0; i < B.length - 1; ++i) {
    for (j = i + 1; j < B.length; ++j) {
      // 如果B[i]、B[j]和p三者任何两个圆的的外围圆都无法包含第一个圆
      // 并且三者的外围圆可以包含所有B，则返回下面数组。
      if (enclosesNot(encloseBasis2(B[i], B[j]), p)
          && enclosesNot(encloseBasis2(B[i], p), B[j])
          && enclosesNot(encloseBasis2(B[j], p), B[i])
          && enclosesWeakAll(encloseBasis3(B[i], B[j], p), B)) {

        // 表示通过这三个元素，及其外围圆就可以包含所有B元素和p圆
        return [B[i], B[j], p];
      }
    }
  }

  // If we get here then something is very wrong.
  throw new Error;
}

// 参数a、b对象表示平面上的圆形对象，属性包括圆半径、圆心坐标点
// 如果圆a半径小于圆b半径，则显然圆a不可能包含圆b
// 根据几何作图可知，如果圆a包含b，则显然dr大于两个圆心距离
// 因此下面判定圆a不包含圆b的逻辑
function enclosesNot(a, b) {
  var dr = a.r - b.r, dx = b.x - a.x, dy = b.y - a.y;
  return dr < 0 || dr * dr < dx * dx + dy * dy;
}

// 之所以增加一个精度1e-6，是为了解决圆b内切圆a的场景
// 下面表示圆a包含圆b（包括内切）
function enclosesWeak(a, b) {
  var dr = a.r - b.r + 1e-6, dx = b.x - a.x, dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

// 如果圆a包含全部的圆B集合，则返回true
function enclosesWeakAll(a, B) {
  for (var i = 0; i < B.length; ++i) {
    if (!enclosesWeak(a, B[i])) {
      return false;
    }
  }
  return true;
}

// 根据B圆列表长度，来返回对应的外围圆对象
function encloseBasis(B) {
  switch (B.length) {
    case 1: return encloseBasis1(B[0]);
    case 2: return encloseBasis2(B[0], B[1]);
    case 3: return encloseBasis3(B[0], B[1], B[2]);
  }
}

// 对平面上圆的表达
function encloseBasis1(a) {
  return {
    x: a.x,
    y: a.y,
    r: a.r
  };
}

// 根据两个圆来得到一个外围圆，使得这两个圆内切该外围圆
function encloseBasis2(a, b) {
  var x1 = a.x, y1 = a.y, r1 = a.r,
      x2 = b.x, y2 = b.y, r2 = b.r,
      x21 = x2 - x1, y21 = y2 - y1, r21 = r2 - r1,

      // 求圆心距离
      l = Math.sqrt(x21 * x21 + y21 * y21);

  // 注意下外围圆的圆心坐标计算，如果两个圆外切，则外围圆圆心为切点位置
  // 如果两个圆内切，则外围圆圆心为较大圆的圆心坐标
  // 如果两个圆相离，则外围圆圆心靠近较大圆圆心
  return {
    x: (x1 + x2 + x21 / l * r21) / 2,
    y: (y1 + y2 + y21 / l * r21) / 2,
    r: (l + r1 + r2) / 2
  };
}

// 计算三个圆的外围圆，根据几何知识可得三个圆不一定能同时内切该外围圆
// 因此下面的算法实际上计算最小的外围圆
function encloseBasis3(a, b, c) {
  var x1 = a.x, y1 = a.y, r1 = a.r,
      x2 = b.x, y2 = b.y, r2 = b.r,
      x3 = c.x, y3 = c.y, r3 = c.r,
      a2 = x1 - x2,
      a3 = x1 - x3,
      b2 = y1 - y2,
      b3 = y1 - y3,
      c2 = r2 - r1,
      c3 = r3 - r1,
      d1 = x1 * x1 + y1 * y1 - r1 * r1,
      d2 = d1 - x2 * x2 - y2 * y2 + r2 * r2,
      d3 = d1 - x3 * x3 - y3 * y3 + r3 * r3,
      ab = a3 * b2 - a2 * b3,
      xa = (b2 * d3 - b3 * d2) / (ab * 2) - x1,
      xb = (b3 * c2 - b2 * c3) / ab,
      ya = (a3 * d2 - a2 * d3) / (ab * 2) - y1,
      yb = (a2 * c3 - a3 * c2) / ab,
      A = xb * xb + yb * yb - 1,
      B = 2 * (r1 + xa * xb + ya * yb),
      C = xa * xa + ya * ya - r1 * r1,
      r = -(A ? (B + Math.sqrt(B * B - 4 * A * C)) / (2 * A) : C / B);
  return {
    x: x1 + xa + xb * r,
    y: y1 + ya + yb * r,
    r: r
  };
}
