import sparse from "./sparse";
import {Selection} from "./index";

// this._exit节点集在操作this.update()时触发
export default function() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}
