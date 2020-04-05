// 几乎所有的d3模块都有这个文件，其提供一种闭包形式来保持参数
export default function(x) {
  return function() {
    return x;
  };
}
