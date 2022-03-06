'use strict';

/**
 * @description: 修改fn的this指向为thisArg
 * @param {Function} fn
 * @param {Object} thisArg
 * @return {Function} 返回修改了this指向的fn
 */
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    // 生成一个参数数组
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    // wrap函数修改fn的指向为thisArg
    return fn.apply(thisArg, args);
  };
};
