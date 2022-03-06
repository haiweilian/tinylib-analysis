'use strict';

/**
 * 判断给定的地址是否为绝对url
 *
 * @param {string} url 要检查的url
 * @returns {boolean} 如果为绝对url返回true，否则返回false
 */
module.exports = function isAbsoluteURL(url) {
  // 如果 URL 以“<scheme>://”或“//”开头，则该 URL 被视为绝对url。
  // RFC 3986 将 scheme 名称定义为以字母开头且后跟字母、数字、加号、句点或连字符的任意组合的字符序列。
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};
