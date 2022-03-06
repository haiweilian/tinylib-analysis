'use strict';

/**
 * 
 * 用于调用函数和扩展参数数组的语法糖。
 * 
 * 常见的用法是`Function.prototype.apply`。
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * 使用 `spread` 来重写上例
 * 
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};
