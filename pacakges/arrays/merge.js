// 注意下面generator函数具有原始的自动执行能力，其根本原因在于数组内生迭代能力。
// 而for...of就是根据迭代对象的next()来迭代
function* flatten(arrays) {
  for (const array of arrays) {
    yield* array;
  }
}

export default function merge(arrays) {
  return Array.from(flatten(arrays));
}
