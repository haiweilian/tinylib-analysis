'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * 仅当请求的 URL 不是绝对 URL 时，才通过将 baseURL 与请求的 URL 组合来创建新 URL。
 * 如果请求的 URL 是绝对URL，此函数会原封不动地返回所请求的 URL。
 *
 * @param {string} baseURL base URL
 * @param {string} requestedURL 要组合的url（绝对或相对）
 * @returns {string} 组合后的url
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  // 仅当请求的 URL 不是绝对 URL 时，才组合
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  // 否则直接返回
  return requestedURL;
};
