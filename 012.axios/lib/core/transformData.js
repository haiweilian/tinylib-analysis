'use strict';

var utils = require('./../utils');
var defaults = require('./../defaults');

/**
 * 转换request或者response对象
 *
 * @param {Object|String} data 要被转换的对象
 * @param {Array} headers 请求或响应的header
 * @param {Array|Function} fns 单个函数或者函数数组
 * @returns {*} 转换后的对象
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    // 主要是调用了fn方法来转换
    data = fn.call(context, data, headers);
  });

  return data;
};
