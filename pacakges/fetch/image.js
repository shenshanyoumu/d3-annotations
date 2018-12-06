// 基于image对象来原生请求图片数据。参数input为URL地址，而init表示配置属性
export default function(input, init) {
  return new Promise(function(resolve, reject) {
    var image = new Image();
    for (var key in init) image[key] = init[key];
    image.onerror = reject;
    image.onload = function() {
      resolve(image);
    };
    image.src = input;
  });
}
