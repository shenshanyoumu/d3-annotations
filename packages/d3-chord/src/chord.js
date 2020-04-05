import {range} from "d3-array";
import {max, tau} from "./math";

function compareValue(compare) {

  // 用于最终对弦图的节点排序，起到美化作用
  // 弦图中每个chord，包含source和target
  return function(a, b) {
    return compare(
      a.source.value + a.target.value,
      b.source.value + b.target.value
    );
  };
}

export default function() {
  // 弦图中相近chord的间隔角度，美化图表作用
  var padAngle = 0,

      // 多条chord的组合
      sortGroups = null,

      // 一个chord对象具有source和target，而source/target可能是多个流量的聚合
      sortSubgroups = null,

      // 对chord数组的排序
      sortChords = null;


  // 矩阵中matrix[i,j]表示两个节点的流量强度
  function chord(matrix) {
    // matrix.length表示弦图中节点数目
    var n = matrix.length,
        groupSums = [],

        // 弦图上所有节点的索引
        groupIndex = range(n),

        // 弦图中一个chord的流量由所关联的其他节点贡献
        subgroupIndex = [],

        // 存放弦图的chord数组
        chords = [],

        groups = chords.groups = new Array(n),
        subgroups = new Array(n * n),
        k,
        x,
        x0,
        dx,
        i,
        j;

    // k表示整个弦图上的流量之和
    k = 0, i = -1; while (++i < n) {
      // 计算弦图中节点i与其他所有节点的流量强度和。这组成节点i的chord的source
      x = 0, j = -1; while (++j < n) {
        x += matrix[i][j];
      }

      // 节点i的流出流量强度之和
      groupSums.push(x);

      // 从节点i流出的chord由一系列子流量构成，因此需要记录
      subgroupIndex.push(range(n));
      k += x;
    }

    // 对弦图中每个chord的排序
    if (sortGroups) groupIndex.sort(function(a, b) {
      return sortGroups(groupSums[a], groupSums[b]);
    });

    //弦图中，一个chord的流量强度由相关联的其他节点贡献。
    // 因此也可能需要排序来美化展示效果
    if (sortSubgroups) subgroupIndex.forEach(function(d, i) {
      d.sort(function(a, b) {
        return sortSubgroups(matrix[i][a], matrix[i][b]);
      });
    });

    // Convert the sum to scaling factor for [0, 2pi].
    // TODO Allow start and end angle to be specified?
    // TODO Allow padding to be specified as percentage?

    // k表示弦图所有流量之和，padAngle表示弦图中相邻chord间的空隙
    // 因此下面的公式表示将流量映射到[0,2pi]
    k = max(0, tau - padAngle * n) / k;
    dx = k ? padAngle : tau / n;

    // Compute the start and end angle for each group and subgroup.
    // Note: Opera has a bug reordering object literal properties!
    x = 0, i = -1; while (++i < n) {
      x0 = x, j = -1; while (++j < n) {
        var di = groupIndex[i],
            dj = subgroupIndex[di][j],
            v = matrix[di][dj],
            a0 = x,
            a1 = x += v * k;

        // 一个chord由节点i与其他所有节点关联的流量聚合
        // 当然如果没有关联，则流量为0
        subgroups[dj * n + di] = {
          index: di,
          subindex: dj,
          startAngle: a0,
          endAngle: a1,
          value: v
        };
      }

      // 弦图中每个chord对象，定义在[0,2pi]圆周上起止弧度，
      // value表示流量强度，index表示该chord的索引
      groups[di] = {
        index: di,
        startAngle: x0,
        endAngle: x,
        value: groupSums[di]
      };
      x += dx;
    }

    // Generate chords for each (non-empty) subgroup-subgroup link.
    i = -1; while (++i < n) {
      j = i - 1; while (++j < n) {

        // chord对象的source/target属性
        var source = subgroups[j * n + i],
            target = subgroups[i * n + j];
        if (source.value || target.value) {
          chords.push(source.value < target.value
              ? {source: target, target: source}
              : {source: source, target: target});
        }
      }
    }

    return sortChords ? chords.sort(sortChords) : chords;
  }

  chord.padAngle = function(_) {
    return arguments.length ? (padAngle = max(0, _), chord) : padAngle;
  };

  // 弦图的chord数组排序
  chord.sortGroups = function(_) {
    return arguments.length ? (sortGroups = _, chord) : sortGroups;
  };

  // 
  chord.sortSubgroups = function(_) {
    return arguments.length ? (sortSubgroups = _, chord) : sortSubgroups;
  };

  chord.sortChords = function(_) {
    return arguments.length ? (_ == null ? sortChords = null : 
      (sortChords = compareValue(_))._ = _, chord) : sortChords && sortChords._;
  };

  return chord;
}
