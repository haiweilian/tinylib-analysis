'use strict';

var Cancel = require('./Cancel');

/**
 *  `CancelToken` 是被用于取消请求操作的类
 *
 * @class
 * @param {Function} executor 执行器
 */
function CancelToken(executor) {
  // 执行器的类型判断
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  // 自定义一个Promise，利用作用域拿到resolve
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  // 给执行器传参为“cancel函数”，通过闭包给到调用方
  // 最终目的是将resolvePromise通过两次闭包拿到外部，给用户来自己取消
  executor(function cancel(message) {
    if (token.reason) {
      // 如果reason属性已经有值，说明已经取消过了
      return;
    }

    // 将取消原因组成的Cancel对象 resolve出去
    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  }
  );
}

/**
 * 把Cancel对象报错抛出去
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * 返回一个对象，对象包含新的"CancelToken"对象和一个函数，该函数在调用时取消"CancelToken"。
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;
