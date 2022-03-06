'use strict';

/**
 * 当操作被取消时会抛出一个Cancel类的对象
 *
 * @class
 * @param {String} message 取消的消息
 */
function Cancel(message) {
  this.message = message;
}

// 给Cancel添加一个toString原型方法
Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

// 是否为Cancel类的标志
Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;
