'use strict';

/*eslint no-console:0*/

/**
 * 警告开发人员：正在使用的方法已被弃用。
 *
 * @param {string} method 被遗弃的方法
 * @param {string} [instead] 替换的新方法
 * @param {string} [docs] 更多细节的文档地址
 */
module.exports = function deprecatedMethod(method, instead, docs) {
  try {
    console.warn(
      'DEPRECATED method `' + method + '`.' +
      (instead ? ' Use `' + instead + '` instead.' : '') +
      ' This method will be removed in a future release.');

    if (docs) {
      console.warn('For more information about usage see ' + docs);
    }
  } catch (e) { /* Ignore */ }
};
