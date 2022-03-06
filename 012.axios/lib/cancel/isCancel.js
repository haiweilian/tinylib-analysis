'use strict';

/**
 * @description: 判断是否为Cancel类的对象
 * @param {Any} value 要判断的值
 * @return {Boolean}
 */
module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};
