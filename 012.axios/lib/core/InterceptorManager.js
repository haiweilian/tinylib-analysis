'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * 给栈中添加一个新的拦截器
 *
 * @param {Function} fulfilled fulfilled后怎么处理then的函数
 * @param {Function} rejected reject后怎么处理reject的函数
 *
 * @return {Number} 便于之后删除拦截器用的ID
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * 从栈中删除一个拦截器
 *
 * @param {Number} id 使用use方法给的id来删除
 */
InterceptorManager.prototype.eject = function eject(id) {
  // 直接把对应的地方设为null
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * 迭代已注册的拦截器
 *
 * 该方法对于跳过任何可能变成"null"的拦截器。
 *
 * @param {Function} fn 使用fn方法来调用每一个拦截器
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;
