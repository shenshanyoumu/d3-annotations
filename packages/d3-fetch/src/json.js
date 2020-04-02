function responseJson(response) {
  if (!response.ok) throw new Error(response.status + " " + response.statusText);
  return response.json();
}

// JSON格式响应报文的拦截
export default function(input, init) {
  return fetch(input, init).then(responseJson);
}
