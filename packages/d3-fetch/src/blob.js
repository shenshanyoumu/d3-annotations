
function responseBlob(response) {
  if (!response.ok) throw new Error(response.status + " " + response.statusText);
  return response.blob();
}

// blob表示binary large object，即二进制大文件。
// 比如将图片、视频等资源转换为各种数据类型通过网络传递
export default function(input, init) {
  return fetch(input, init).then(responseBlob);
}
