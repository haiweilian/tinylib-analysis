'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

    // 标准浏览器完全支持给定URL与当前URL是否同源的检测
    (function standardBrowserEnv() {
      // 判断是否为IE浏览器
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
      * 解析一个URL，将其分解为各个部分
      *
      * @param {String} url 要解析的URL
      * @returns {Object} 返回各个部分组成的对象
      */
      function resolveURL(url) {
        var href = url;

        if (msie) {
          // IE浏览器需要设置两次才能标准化属性
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode 提供了 UrlUtils 接口 - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      // 最后获得的location的各个部分组成的对象
      originURL = resolveURL(window.location.href);

      /**
      * 判断URL与location是否同源
      * 
      * @param {String} requestURL 要检查的url
      * @returns {boolean} 如果同源则返回true，否则返回false
      */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        // protocol、hostname、port都相等才是同源
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

    // 非标准的浏览器环境(web workers, react-native)都默认为同源
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);
