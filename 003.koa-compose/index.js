"use strict";

/**
 * Expose compositor.
 */

module.exports = compose;

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose(middleware) {
  if (!Array.isArray(middleware))
    throw new TypeError("Middleware stack must be an array!");
  for (const fn of middleware) {
    if (typeof fn !== "function")
      throw new TypeError("Middleware must be composed of functions!");
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */
  // 本质上就是一个嵌套的高阶函数，外层的中间件嵌套着内层的中间件。
  // 递归的机制，一层嵌套一层。调用 next 之前是 "递"，之后是 "归"。
  return function (context, next) {
    // last called middleware #
    let index = -1;
    // 从下标为 0 开始执行中间件。
    return dispatch(0);

    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      // 找出数组中存放的相应的中间件
      let fn = middleware[i];

      // 不存在返回，最后一个中间件调用 next 也不会报错。
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();

      try {
        return Promise.resolve(
          // 执行当前中间件
          fn(
            // 第一个参数是 ctx。
            context,
            // 第二个参数是 next，代表下一个中间件。
            dispatch.bind(null, i + 1)
          )
        );
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
