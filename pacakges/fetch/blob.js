// 解析从网络接收的数据，并转换为二进制块格式返回
function responseBlob(response) {
  if (!response.ok)
    throw new Error(response.status + " " + response.statusText);
  return response.blob();
}

export default function(input, init) {
  return fetch(input, init).then(responseBlob);
}
