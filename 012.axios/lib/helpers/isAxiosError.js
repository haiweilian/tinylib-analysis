'use strict';

/**
 * 判断error是否为Axios抛出的
 *
 * @param {*} payload 要检测的error
 * @returns {boolean} 如果error为Axios抛出的则返回true，否则返回false
 */
module.exports = function isAxiosError(payload) {
  // 通过isAxiosError来判断
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};
