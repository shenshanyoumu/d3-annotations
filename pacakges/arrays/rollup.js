// 按照keys对迭代结构元素进行分组
function dogroup(values, keyof) {
  const map = new Map();
  let index = -1;
  for (const value of values) {
    const key = keyof(value, ++index, values);
    const group = map.get(key);
    if (group) {
      group.push(value);
    } else map.set(key, [value]);
  }
  return map;
}

// 在D3的nested结构可视化过程，经常需要对分组进行“卷缩”处理。即先分组再分别计算每组的合计
// 在SQL操作中，也经常有 group by XXX rollup的子句
export default function rollup(values, reduce, ...keys) {
  return (function regroup(values, i) {
    if (i >= keys.length) {
      return reduce(values);
    }
    const map = dogroup(values, keys[i]);
    return new Map(Array.from(map, ([k, v]) => [k, regroup(v, i + 1)]));
  })(values, 0);
}
