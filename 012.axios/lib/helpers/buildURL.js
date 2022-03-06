'use strict';

var utils = require('./../utils');

function encode(val) {
  // 正常encodeURIComponent不转义的字符： A-Z a-z 0-9 - _ . ! ~ * ' ( )
  // 先转义val，再把:$,+[]这几个字符解码回来
  // 所以最后A-Z a-z 0-9 - _ . ! ~ * ' ( ) : $ , + [ ]这几个字符不转义，其他都转义
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * 通过把params加到url的最后面来创建完整url
 *
 * @param {string} url  url的主机名 (例如 http://www.google.com)
 * @param {object} [params] 要添加的参数
 * @returns {string} 格式化后的参数 http://www.google.com?a=1&b=2
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  // 没有参数就直接返回
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  // 如果有params序列方法，就执行下然后返回
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
    // 如果是一个URLSearchParams对象，就返回toString()的结果
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
    // 否则就进行普通序列化
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      // 值为null或者undefined时,就不添加
      if (val === null || typeof val === 'undefined') {
        return;
      }

      // 值如果是个数组就给键封一层[]
      if (utils.isArray(val)) {
        key = key + '[]';
        // 值如果不是数组,就包装成数组
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        // 如果是date对象,就变为YYYY-MM-DDTHH:mm:ss.sssZ格式
        if (utils.isDate(v)) {
          v = v.toISOString();
          // 如果是个对象,就stringify
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        // 最后把parts中的值变为key=value格式
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    // 最后封装为key1=value1&key2=value2的格式
    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    // 从url中提取出#之前的部分
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    // 如果之前没有params就加个? 如果有params就加个&
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};
