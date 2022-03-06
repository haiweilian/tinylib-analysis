'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');
var validator = require('../helpers/validator');

var validators = validator.validators;
/**
 * 创建一个Axios的新实例
 *
 * @param {Object} instanceConfig 实例的配置
 */
function Axios(instanceConfig) {
  // 存储配置和请求响应拦截器
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * 原型上的发送请求方法
 *
 * @param {Object} config 请求时的配置（已经与默认配置合并）
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // 当config为字符串时,允许axios('example/url'[, config])这种风格的请求
  if (typeof config === 'string') {
    // 从arguments中取参数
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  // 合并手动和默认配置
  config = mergeConfig(this.defaults, config);

  // 设置config上的method属性,优先手动,次之默认,如果都没配置就选get
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // 断言版本问题
  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // 过滤拦截器
  // 设一个空数组来保存全部的请求拦截器
  var requestInterceptorChain = [];
  // 拦截是否异步的标志
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    // 时机不对，不能添加到拦截器链中
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    // 只要有一个不是同步，就设为false
    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
    // 保存拦截器
    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  // 同样设一个空数组来保存全部的响应拦截器
  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    // 保存拦截器
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  // 如果含有异步的拦截器，则进行异步的处理方式
  if (!synchronousRequestInterceptors) {
    // 把选择适配器发送请求的方法放在chain数组的最后
    var chain = [dispatchRequest, undefined];

    // 请求拦截器放到数组前面
    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    // 响应拦截器放到数组后面
    chain.concat(responseInterceptorChain);

    // 将config作为promise链的第一个
    promise = Promise.resolve(config);
    // 循环执行promise
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  // 如果没有异步拦截器，则进行同步处理方式
  var newConfig = config;
  // 循环请求拦截器
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    // 执行拦截器的fulfilled
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  // 将请求派发出去
  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  // 循环响应拦截器
  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  // 最后把结果返回
  return promise;
};

/**
 * @description: 通过config的配置组装url
 * @param {Object} config 配置
 * @return {String} 返回拼装成的uri
 */
Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// 给每个method添加别名，这四个方法有可能是没有data的
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

// 下面三个方法有data
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;
