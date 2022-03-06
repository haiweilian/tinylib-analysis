'use strict';

var utils = require('../utils');

/**
 * 配置专用的的合并函数，通过将两个配置对象合并在一起，创建一个新的配置对象。
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} 从config1和config2合并出来的新对象
 */
module.exports = function mergeConfig(config1, config2) {
  // 给config2默认为空对象
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  // 全部来源于config2的键
  var valueFromConfig2Keys = ['url', 'method', 'data'];
  // 优先来源于config2的键，深度合并会判别undefined
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  // 优先来源于config2的键，不进行深度合并
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  // 优先来源于config2的键，直接深度合并 使用in来判断
  var directMergeKeys = ['validateStatus'];

  /**
   * @description: 两个同名属性 merge 时的规则，source 比 target 优先级高
   * @param {Object} target 要合并的属性
   * @param {Object} source 源属性
   * @return {Object} 最后返回source
   */  
  function getMergedValue(target, source) {
    // 普通对象直接执行merge方法
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
      // 如果target不是纯对象,就把target抛弃
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
      // 如果source是个数组,就返回source的副本
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  /**
   * @description: 深度合并方法
   * @param {string} prop 键
   */  
  function mergeDeepProperties(prop) {
    // 如果config2中该键存在,就直接执行合并
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
      // 如果config2中该键不存在,但config1中该键存在,就直接取config1
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  // 1.如果是需要config2的键,就直接从config2中把值拿过来,绝对不会取config1
  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  // 2.需要深度合并的键就执行深度合并方法
  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  // 3.config2优先的键,就优先取config2,如果没有才取config1
  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  // 4.直接合并,这个跟深度合并的区别是用in来做判别,也就是undefined的区别
  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  // axios专用的配置的键
  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  // 用户加的自定义配置的键
  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      // 把axios专用的键过滤掉
      return axiosKeys.indexOf(key) === -1;
    });

  // 5.用户自定义配置的键执行深度合并
  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};
