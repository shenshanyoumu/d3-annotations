// 将随机数生成空间从[0,1]映射到[-0.5,0.5]
export default function() {
  return (Math.random() - 0.5) * 1e-6;
}
