'use strict';

var utils = require('./../utils');

// 下面数组中的header，如果出现了重复，就忽略掉
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * 把报文头字符串解析为对象
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers 需要解析的报文头字符串
 * @returns {Object} 解析后的对象
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  // 没有header就返回空对象
  if (!headers) { return parsed; }

  // headers字符串首先通过换行符来分割为数组
  utils.forEach(headers.split('\n'), function parser(line) {
    // 拿到每个header的键和值
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      // 如果key在“重复则忽略”的名单中，并且重复了，就忽略掉
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      // 对“set-cookie”进行专门处理
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        // 普通的header，在值字符串后面追加重复的值
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};
