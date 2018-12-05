import sparse from "./sparse";
import { Selection } from "./index";

// 当数据集规模小于DOM集规模，则需要调整选择集实例的绑定结构
export default function() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}
