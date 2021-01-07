
// 计算两个向量AB和AC的叉积，在笛卡尔坐标系中。
// 叉积还是向量注意判别方向性
export default function(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}
