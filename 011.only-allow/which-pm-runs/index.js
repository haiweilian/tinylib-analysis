'use strict'

module.exports = function () {
  if (!process.env.npm_config_user_agent) {
    return undefined
  }
  return pmFromUserAgent(process.env.npm_config_user_agent)
}

// yarn/1.22.17 npm/? node/v14.17.0 darwin x64
// process.env.npm_config_user_agent 是包管理工具实现的一个字段，类似于浏览器的 navigator.userAgent。
function pmFromUserAgent (userAgent) {
  const pmSpec = userAgent.split(' ')[0]
  const separatorPos = pmSpec.lastIndexOf('/')
  // 返回名称和版本
  return {
    name: pmSpec.substr(0, separatorPos),
    version: pmSpec.substr(separatorPos + 1)
  }
}
