'use strict'

// 命名空间的格式验证
var scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$')
// node 的内置模块 比如 fs、path、http 等。https://github.com/juliangruber/builtins/blob/master/index.js
var builtins = require('builtins')
// 黑名单列表
var blacklist = [
  'node_modules',
  'favicon.ico'
]

var validate = module.exports = function (name) {
  // 警告信息
  var warnings = []
  // 错误信息
  var errors = []

  // 名称不能为 null
  if (name === null) {
    errors.push('name cannot be null')
    return done(warnings, errors)
  }

  // 名称不能为 undefined
  if (name === undefined) {
    errors.push('name cannot be undefined')
    return done(warnings, errors)
  }

  // 名称必须是一个字符串
  if (typeof name !== 'string') {
    errors.push('name must be a string')
    return done(warnings, errors)
  }

  // 名称不能为空
  if (!name.length) {
    errors.push('name length must be greater than zero')
  }

  // 名称不能以 . 开头
  if (name.match(/^\./)) {
    errors.push('name cannot start with a period')
  }

  // 名称不能以 _ 开头
  if (name.match(/^_/)) {
    errors.push('name cannot start with an underscore')
  }

  // 名称前后不能包含空格
  if (name.trim() !== name) {
    errors.push('name cannot contain leading or trailing spaces')
  }

  // No funny business
  // 名称不能是黑名单列表的
  blacklist.forEach(function (blacklistedName) {
    if (name.toLowerCase() === blacklistedName) {
      errors.push(blacklistedName + ' is a blacklisted name')
    }
  })

  // Generate warnings for stuff that used to be allowed

  // core module names like http, events, util, etc
  // 名称不能是内置核心模块
  builtins.forEach(function (builtin) {
    if (name.toLowerCase() === builtin) {
      warnings.push(builtin + ' is a core module name')
    }
  })

  // really-long-package-names-------------------------------such--length-----many---wow
  // the thisisareallyreallylongpackagenameitshouldpublishdowenowhavealimittothelengthofpackagenames-poch.
  // 名称最大长度不能超过 214
  if (name.length > 214) {
    warnings.push('name can no longer contain more than 214 characters')
  }

  // mIxeD CaSe nAMEs
  // 名称不能包含大小字符
  if (name.toLowerCase() !== name) {
    warnings.push('name can no longer contain capital letters')
  }

  // 不能包含特殊字符
  if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
    warnings.push('name can no longer contain special characters ("~\'!()*")')
  }

  // 如果是命名空间
  if (encodeURIComponent(name) !== name) {
    // Maybe it's a scoped package name, like @user/package
    var nameMatch = name.match(scopedPackagePattern)
    if (nameMatch) {
      var user = nameMatch[1]
      var pkg = nameMatch[2]
      if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
        return done(warnings, errors)
      }
    }

    errors.push('name can only contain URL-friendly characters')
  }

  return done(warnings, errors)
}

validate.scopedPackagePattern = scopedPackagePattern

var done = function (warnings, errors) {
  var result = {
    validForNewPackages: errors.length === 0 && warnings.length === 0,
    validForOldPackages: errors.length === 0,
    warnings: warnings,
    errors: errors
  }
  if (!result.warnings.length) delete result.warnings
  if (!result.errors.length) delete result.errors
  return result
}
