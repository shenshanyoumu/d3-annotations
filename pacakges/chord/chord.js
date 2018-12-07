import { range } from "d3-array";
import { max, tau } from "./math";

// 注意下面a/b参数表示两个chord对象，而每个chord具有属性source/target表示弦两端的subgroup对象
// 每个subgroup对象具有的value值表示subgroup的流量强度

// 下面参数compare表示比较器函数，用于比较弦两端subgroup的流量强度和的大小
function compareValue(compare) {
  return function(a, b) {
    return compare(
      a.source.value + a.target.value,
      b.source.value + b.target.value
    );
  };
}
// 弦生成器，注意一个完整的弦图包括圆环、分割的圆弧，以及圆弧上的说明信息或者刻度信息，当然还包括绶带
// 但是弦生成器并不会生成刻度信息/说明信息，因此在开发中还需要开发者自己实现
export default function() {
  var padAngle = 0,
    // 下面sortGroups表示弦图中被分割的圆弧，一个圆弧上可能包含多个subgroup。而两个具有联系的subgroup形成一chord对象
    sortGroups = null,
    // 对构成弦对象的subgroup排序
    sortSubgroups = null,
    // 对弦对象排序
    sortChords = null;

  // 参数matrix表示两个节点之间的流量强度
  function chord(matrix) {
    var n = matrix.length,
      groupSums = [],
      groupIndex = range(n),
      subgroupIndex = [],
      chords = [],
      groups = (chords.groups = new Array(n)),
      subgroups = new Array(n * n),
      k,
      x,
      x0,
      dx,
      i,
      j;

    // Compute the sum.
    (k = 0), (i = -1);
    while (++i < n) {
      (x = 0), (j = -1);
      while (++j < n) {
        x += matrix[i][j];
      }
      groupSums.push(x);
      subgroupIndex.push(range(n));
      k += x;
    }

    // Sort groups…
    if (sortGroups)
      groupIndex.sort(function(a, b) {
        return sortGroups(groupSums[a], groupSums[b]);
      });

    // Sort subgroups…
    if (sortSubgroups)
      subgroupIndex.forEach(function(d, i) {
        d.sort(function(a, b) {
          return sortSubgroups(matrix[i][a], matrix[i][b]);
        });
      });

    // Convert the sum to scaling factor for [0, 2pi].
    // TODO Allow start and end angle to be specified?
    // TODO Allow padding to be specified as percentage?
    k = max(0, tau - padAngle * n) / k;
    dx = k ? padAngle : tau / n;

    // Compute the start and end angle for each group and subgroup.
    // Note: Opera has a bug reordering object literal properties!
    (x = 0), (i = -1);
    while (++i < n) {
      (x0 = x), (j = -1);
      while (++j < n) {
        var di = groupIndex[i],
          dj = subgroupIndex[di][j],
          v = matrix[di][dj],
          a0 = x,
          a1 = (x += v * k);
        subgroups[dj * n + di] = {
          index: di,
          subindex: dj,
          startAngle: a0,
          endAngle: a1,
          value: v
        };
      }
      groups[di] = {
        index: di,
        startAngle: x0,
        endAngle: x,
        value: groupSums[di]
      };
      x += dx;
    }

    // Generate chords for each (non-empty) subgroup-subgroup link.
    i = -1;
    while (++i < n) {
      j = i - 1;
      while (++j < n) {
        var source = subgroups[j * n + i],
          target = subgroups[i * n + j];
        if (source.value || target.value) {
          chords.push(
            source.value < target.value
              ? { source: target, target: source }
              : { source: source, target: target }
          );
        }
      }
    }

    return sortChords ? chords.sort(sortChords) : chords;
  }

  // 弦图圆弧之间的间隔角度
  chord.padAngle = function(_) {
    return arguments.length ? ((padAngle = max(0, _)), chord) : padAngle;
  };

  // 根据传入的比较器，对弦图的圆弧进行排序
  chord.sortGroups = function(_) {
    return arguments.length ? ((sortGroups = _), chord) : sortGroups;
  };

  // 对构成chord的所有subgroup排序
  chord.sortSubgroups = function(_) {
    return arguments.length ? ((sortSubgroups = _), chord) : sortSubgroups;
  };

  // 注意定义，一个chord对象由两个连接的subgroup构成；
  // 而一个group由多个subgroup构成，这些subgroup之间可能具有连接关系
  // 而弦图的整个圆弧由多个groups构成
  chord.sortChords = function(_) {
    return arguments.length
      ? (_ == null
          ? (sortChords = null)
          : ((sortChords = compareValue(_))._ = _),
        chord)
      : sortChords && sortChords._;
  };

  return chord;
}
