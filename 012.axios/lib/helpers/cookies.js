'use strict';

var utils = require('./../utils');

module.exports = (
  // 先判断是不是标准的浏览器环境
  utils.isStandardBrowserEnv() ?

  // 标准的浏览器环境支持 document.cookie
    (function standardBrowserEnv() {
      return {
        // 把cookie的字段一个个写进去
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        // 通过正则来读取cookie的值
        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        // 通过设置过期时间来移除cookie
        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

    // 非标准的浏览器环境(web workers, react-native)不支持 document.cookie
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);
