function responseText(response) {
  if (!response.ok)
   throw new Error(response.status + " " + response.statusText);
  return response.text();
}

// 响应未文本报文的拦截处理
export default function(input, init) {
  return fetch(input, init).then(responseText);
}
