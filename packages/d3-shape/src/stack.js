import {slice} from "./array.js";
import constant from "./constant.js";
import offsetNone from "./offset/none.js";
import orderNone from "./order/none.js";

// 堆叠生成器，注意d3良好的功能切割，使得多种生成器可以正交组合
// 堆叠生成器和直方图生成器可以生成堆叠图；
// 堆叠生成器和area生成器可以生成面积堆叠图
function stackValue(d, key) {
  return d[key];
}

export default function() {
  var keys = constant([]),
      order = orderNone,
      offset = offsetNone,
      value = stackValue;

  // data表示数据数组
  function stack(data) {
    var kz = keys.apply(this, arguments),
        i,
        m = data.length,
        n = kz.length,
        sz = new Array(n),
        oz;

    // 
    for (i = 0; i < n; ++i) {
      for (var ki = kz[i], si = sz[i] = new Array(m), j = 0, sij; 
      j < m; ++j) {

        si[j] = sij = [0, +value(data[j], ki, j, data)];
        sij.data = data[j];
      }
      si.key = ki;
    }

    for (i = 0, oz = order(sz); i < n; ++i) {
      sz[oz[i]].index = i;
    }

    offset(sz, oz);
    return sz;
  }

  stack.keys = function(_) {
    return arguments.length ? (keys = typeof _ === "function" ? _ : constant(slice.call(_)), stack) : keys;
  };

  stack.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), stack) : value;
  };

  stack.order = function(_) {
    return arguments.length ? (order = _ == null ? orderNone : typeof _ === "function" ? _ : constant(slice.call(_)), stack) : order;
  };

  stack.offset = function(_) {
    return arguments.length ? (offset = _ == null ? offsetNone : _, stack) : offset;
  };

  return stack;
}
