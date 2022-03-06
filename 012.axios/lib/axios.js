'use strict';

// 导入工具对象
var utils = require('./utils');
var bind = require('./helpers/bind');
// 引入core模块下的Axios类
var Axios = require('./core/Axios');
// 合并配置的方法
var mergeConfig = require('./core/mergeConfig');
// 默认配置
var defaults = require('./defaults');

/**
 * 创建一个Axios实例
 *
 * @param {Object} defaultConfig 实例的默认配置
 * @return {Axios} 一个Axios的新实例
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // 将 axios.prototype 复制到实例上
  utils.extend(instance, Axios.prototype, context);

  // 将 context 复制到实例上
  utils.extend(instance, context);

  return instance;
}

// 创建要导出的默认实例
var axios = createInstance(defaults);

// 将Axios类暴露在实例上,允许类继承
axios.Axios = Axios;

// 创建新实例的工厂方法
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// 将取消请求的相关方法暴露在实例上
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// 将all和spread方法暴露到实例上
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// 将判断是否为Axios错误的 isAxiosError 方法暴露到实例上
axios.isAxiosError = require('./helpers/isAxiosError');

// 导出
module.exports = axios;

// 适配TypeScript中的import语法
module.exports.default = axios;
