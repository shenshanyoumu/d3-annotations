import namespaces from "./namespaces";

/**
 * @param {*} name 类似"xml"或者"xml:xxx"形式。
 * 最终返回预置在namespaces中的同key键值对
 */
export default function(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") 
    name = name.slice(i + 1);
   
  return namespaces.hasOwnProperty(prefix) ? {
    space: namespaces[prefix], 
    local: name} : name;
}
