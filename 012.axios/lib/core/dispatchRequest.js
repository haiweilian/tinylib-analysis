'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * 如果取消请求的行为已经执行，则抛出一个 Cancel 对象
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * 使用已经配置好的适配器，向服务器发送请求
 *
 * @param {object} config 被用于发送请求的配置
 * @returns {Promise} 处理完的promise
 */
module.exports = function dispatchRequest(config) {
  // 若请求已取消，则抛出Cancel对象
  throwIfCancellationRequested(config);

  // 确保header存在
  config.headers = config.headers || {};

  // 利用header和data，以及请求转换器来转换data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // 合并请求头
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  // 清理掉headers中的请求method
  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  // 选择一个适配器
  var adapter = config.adapter || defaults.adapter;

  // 返回一个promise
  return adapter(config).then(function onAdapterResolution(response) {
    // 同样，若请求已取消，则抛出Cancel对象
    throwIfCancellationRequested(config);

    // 利用header和data，以及响应转换器来转换data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    // 同样，若请求已取消，则抛出Cancel对象
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // 利用header和data，以及响应转换器来转换data
      if (reason && reason.response) {
        // 添加到reason下的response属性中
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};
