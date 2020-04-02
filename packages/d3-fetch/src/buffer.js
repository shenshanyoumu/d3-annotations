// arrayBuffer表示二进制缓存形式，需要视图来解释数据含义
function responseArrayBuffer(response) {
  if (!response.ok) throw new Error(response.status + " " + response.statusText);
  return response.arrayBuffer();
}

export default function(input, init) {
  return fetch(input, init).then(responseArrayBuffer);
}
