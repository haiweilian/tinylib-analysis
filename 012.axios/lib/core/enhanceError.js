'use strict';

/**
 * 使用指定的配置、错误代码和响应来升级Error。
 *
 * @param {Error} error 要升级的error对象
 * @param {Object} config 配置.
 * @param {string} [code] 错误代码 (比如, 'ECONNABORTED').
 * @param {Object} [request] 请求对象.
 * @param {Object} [response] 响应对象.
 * @returns {Error} 返回升级后的error对象.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  // 把各种属性赋给error对象
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  // 自定义一个toJSON方法，进行了序列化
  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};
