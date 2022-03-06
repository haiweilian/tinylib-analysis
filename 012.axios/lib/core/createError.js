'use strict';

var enhanceError = require('./enhanceError');

/**
 * 使用指定的message、配置、错误代码、请求和响应来创建Error。
 *
 * @param {string} message 错误 message.
 * @param {Object} config 配置.
 * @param {string} [code] 错误代码 (比如 'ECONNABORTED').
 * @param {Object} [request] 请求对象.
 * @param {Object} [response] 响应对象.
 * @returns {Error} 创建后的错误对象.
 */
module.exports = function createError(message, config, code, request, response) {
  // 创建一个错误后给它添加各种属性
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};
