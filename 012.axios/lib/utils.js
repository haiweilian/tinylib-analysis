'use strict';

// 引入绑定this指向的bind方法
var bind = require('./helpers/bind');

// utils 是一个通用的辅助函数库,不特定于axios使用

// 借用Object原型上的toString方法
var toString = Object.prototype.toString;

/**
 * 判断value是否为数组
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是数组返回true,否则返回false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * 判断value是否为undefined
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是undefined返回true,否则返回false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * 判断value是否为Buffer
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是Buffer返回true,否则返回false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * 判断value是否为ArrayBuffer
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是ArrayBuffer返回true,否则返回false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * 判断value是否为FormData
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是FormData返回true,否则返回false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * 判断value是否为ArrayBuffer上的view
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是ArrayBuffer上的view返回true,否则返回false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * 判断value是否为String
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是String返回true,否则返回false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * 判断value是否为Number
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是Number返回true,否则返回false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * 判断value是否为Object
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是Object返回true,否则返回false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * 判断value是否为 纯Object
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是 纯Object 返回true,否则返回false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * 判断value是否为 Date
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是 Date 返回true,否则返回false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * 判断value是否为 File
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是 File 返回true,否则返回false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * 判断value是否为 Blob
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是 Blob 返回true,否则返回false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * 判断value是否为 Function
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是 Function 返回true,否则返回false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * 判断value是否为 Stream
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是 Stream 返回true,否则返回false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * 判断value是否为 URLSearchParams对象
 *
 * @param {Object} val 要检验的值
 * @returns {boolean} 是 URLSearchParams对象 返回true,否则返回false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * 修剪字符串前后的空白
 *
 * @param {String} str 要修剪的字符串
 * @returns {String} 去除前后空白后的字符串
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * 判断是否运行在标准浏览器环境中
 *
 * 允许 axios 在浏览器工作者线程和react-native中运行。
 * 两种环境都支持 XMLHttpRequest，但并不是完全标准的全局变量。
 *
 * 浏览器工作者线程:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * 迭代数组或对象，对每一子项都执行一个回调函数
 *
 * 如果 `obj` 是一个数组，将会将子项值、索引和整个数组传给回调函数
 * 如果 `obj` 是一个对象，将会将子项值、子项键和整个对象传给回调函数
 * 
 * @param {Object|Array} obj 要迭代的对象
 * @param {Function} fn 对每一项执行的回调函数
 */
function forEach(obj, fn) {
  // 如果obj没有值，就直接return
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // 如果obj不是一个对象，就封装成数组
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // 迭代数组值
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // 迭代对象键
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * varargs 期望每个参数都是一个对象，然后合并每个对象的属性并返回新结果(原来的对象不可变)。
 * 
 * 当多个对象包含相同的键时，参数列表中后面的对象将覆盖之前的。
 *
 * 举例:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // 输出 456
 * ```
 *
 * @param {Object} obj1 要合并的对象
 * @returns {Object} 合并所有属性后的结果
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  // 一个递归方法,合并值到result中去(把引用类型都拆开)
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  // 每个参数都需要执行一遍,全都合并到result中去
  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * 使用对象 b 的属性来扩展对象 a(修改了对象a本身)。
 *
 * @param {Object} a 要被扩展的对象
 * @param {Object} b 扩展属性的来源对象
 * @param {Object} thisArg 要绑定的this指向
 * @return {Object} 修改后的a对象
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    // 如果指定了this指向,并且此属性为函数,则重新绑定this指向
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * 删除Byte Order Mark。捕获 EF BB BF（UTF-8 BOM）
 * 主要是处理编码问题
 *
 * @param {string} content 带有 BOM 的内容
 * @return {string} 删除 BOM 后的内容
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};
