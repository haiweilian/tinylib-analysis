'use strict';

var utils = require('../utils');

/**
 * @description: 标准化报文头部信息
 * @param {Object} headers 请求头对象
 * @param {String} normalizedName 标准化的请求头key
 */
module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    // 当请求头的key大小写不标准时，修改为标准的
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};
