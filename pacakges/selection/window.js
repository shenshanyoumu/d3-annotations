// 针对不同的运行环境进行后续处理，因此需要先判定运行环境
export default function(node) {
  return (
    (node.ownerDocument && node.ownerDocument.defaultView) || // node is a Node
    (node.document && node) || // node is a Window
    node.defaultView
  ); // node is a Document
}
