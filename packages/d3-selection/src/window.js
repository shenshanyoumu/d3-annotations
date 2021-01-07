/** 
 * 在多种宿主环境上使用selection模块
 * 包括node、Window和Document三种 
 * */
export default function(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) 
      || (node.document && node) 
      || node.defaultView; 
}
