'use strict';

var createError = require('./createError');

/**
 * 依据响应状态来 resolve 或 reject 一个 Promise.
 *
 * @param {Function} resolve resolve函数.
 * @param {Function} reject reject函数.
 * @param {object} response 响应对象.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // 只有validateStatus方法校验通过时，才会resolve
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
    // 否则reject升级后的错误对象
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};
