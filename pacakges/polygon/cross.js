//返回向量AB和AC的叉积；
// 由于向量具有方向性，规定三个点构成的向量逆时针则返回正；否则负
export default function(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}
