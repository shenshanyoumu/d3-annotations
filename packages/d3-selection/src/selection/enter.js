import sparse from "./sparse";
import {Selection} from "./index";

// d3在enter()操作时创建了一个新的选择集对象，当进行data()时会触发DOM节点的增加
export default function() {

  // 主要this._enter指向EnterNode对象。
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}

// 单链表形式阻止
export function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,

  // 在this._next指向的节点之前插入child节点
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  // 在给定的next节点之前插入child节点
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },

  // 基于DOM的querySelector和给定的selector选择器进行节点选择
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};
