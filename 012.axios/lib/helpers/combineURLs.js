'use strict';

/**
 * 通过组合host和相对地址来创建新的url
 *
 * @param {string} baseURL host地址
 * @param {string} relativeURL 相对地址
 * @returns {string} 组合后的地址
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    // 组合的时候，把host地址的最后的 / 去掉, 把相对地址前面的 / 去掉
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};
