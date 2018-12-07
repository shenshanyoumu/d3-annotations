import { shuffle, slice } from "../array";

// 参数为circle数组，每个元素表示一个circle对象
export default function(circles) {
  var i = 0,
    // 对circles数组进行混淆处理，增强最终展示的随机性
    n = (circles = shuffle(slice.call(circles))).length,
    B = [],
    p,
    e;

  while (i < n) {
    p = circles[i];
    if (e && enclosesWeak(e, p)) {
      ++i;
    } else {
      (e = encloseBasis((B = extendBasis(B, p)))), (i = 0);
    }
  }

  // 表示能够包含参数circles的容器circle的坐标信息
  return e;
}

function extendBasis(B, p) {
  var i, j;

  // 如果暂时保存在B数组中的所有circles都被p包裹，则p就是这些circle的容器circle
  if (enclosesWeakAll(p, B)) {
    return [p];
  }

  // 此时B数组有至少一个元素
  for (i = 0; i < B.length; ++i) {
    if (enclosesNot(p, B[i]) && enclosesWeakAll(encloseBasis2(B[i], p), B)) {
      return [B[i], p];
    }
  }

  // 下面对所有B中的circle，计算得到最小的容器circle对象
  for (i = 0; i < B.length - 1; ++i) {
    for (j = i + 1; j < B.length; ++j) {
      if (
        enclosesNot(encloseBasis2(B[i], B[j]), p) &&
        enclosesNot(encloseBasis2(B[i], p), B[j]) &&
        enclosesNot(encloseBasis2(B[j], p), B[i]) &&
        enclosesWeakAll(encloseBasis3(B[i], B[j], p), B)
      ) {
        return [B[i], B[j], p];
      }
    }
  }

  throw new Error();
}

// 下面函数判定图形b是否无法包裹在图形a之内
function enclosesNot(a, b) {
  var dr = a.r - b.r,
    dx = b.x - a.x,
    dy = b.y - a.y;
  return dr < 0 || dr * dr < dx * dx + dy * dy;
}

// 在packing图中，一个大circle嵌套多个小circle，需要确保小circle完全在大circle中
function enclosesWeak(a, b) {
  var dr = a.r - b.r + 1e-6,
    dx = b.x - a.x,
    dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

// 下面确保所有的小circles都完全在大circle之内，但是没有保证小circle之间是否重叠
function enclosesWeakAll(a, B) {
  for (var i = 0; i < B.length; ++i) {
    if (!enclosesWeak(a, B[i])) {
      return false;
    }
  }
  return true;
}

function encloseBasis(B) {
  switch (B.length) {
    case 1:
      return encloseBasis1(B[0]);
    case 2:
      return encloseBasis2(B[0], B[1]);
    case 3:
      return encloseBasis3(B[0], B[1], B[2]);
  }
}

// 要包含图形a则最小容器就是本身
function encloseBasis1(a) {
  return {
    x: a.x,
    y: a.y,
    r: a.r
  };
}

// 要完全包裹图形a和b，则需要设置容器图形的中心坐标和最小半径
function encloseBasis2(a, b) {
  var x1 = a.x,
    y1 = a.y,
    r1 = a.r,
    x2 = b.x,
    y2 = b.y,
    r2 = b.r,
    x21 = x2 - x1,
    y21 = y2 - y1,
    r21 = r2 - r1,
    l = Math.sqrt(x21 * x21 + y21 * y21);
  return {
    x: (x1 + x2 + (x21 / l) * r21) / 2,
    y: (y1 + y2 + (y21 / l) * r21) / 2,
    r: (l + r1 + r2) / 2
  };
}

// 要完全包裹下面三个图形，则容器图形需要的中心点坐标和最小半径
function encloseBasis3(a, b, c) {
  var x1 = a.x,
    y1 = a.y,
    r1 = a.r,
    x2 = b.x,
    y2 = b.y,
    r2 = b.r,
    x3 = c.x,
    y3 = c.y,
    r3 = c.r,
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
