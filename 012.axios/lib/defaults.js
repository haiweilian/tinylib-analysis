'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');
var enhanceError = require('./core/enhanceError');

// 默认的content-type类型为form-urlencoded
var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

// 如果content-type没有设置，就设置content-type为value
function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

// 获取默认的adapter
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // 浏览器使用 XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // nodejs使用 HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {

  // 以下三个options是过渡性的
  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  // 选择默认的适配器
  adapter: getDefaultAdapter(),

  // 请求时转化
  transformRequest: [function transformRequest(data, headers) {
    // 标准化accept和content-type请求头
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    // FormData、ArrayBuffer、Buffer、Stream、File、Blob类型时，直接返回data
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    // ArrayBuffer的View类型时，返回buffer
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    // URLSearchParam类型时，返回toString方法的结果
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    // 为其他对象时或者content-type为json时，返回stringify的结果
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return JSON.stringify(data);
    }
    return data;
  }],

  // 响应时转化
  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    // 解析响应结果
    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        // 报错时返回错误对象
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * 中止请求的超时时间（以毫秒为单位）。如果设置为 0（默认），则不会限制超时。
   */
  timeout: 0,

  // XSRF的配置
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  // content和body的最大长度限制
  maxContentLength: -1,
  maxBodyLength: -1,

  // 校验状态，只有2开头的请求才是正常响应
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

// 默认headers
defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

// 设置六种方法的Content-Type
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;
