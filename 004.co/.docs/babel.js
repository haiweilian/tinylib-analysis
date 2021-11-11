"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  // 判断是否结束
  if (info.done) {
    resolve(value);
  } else {
    // 当前编译器对象执行完，继续调用下一个 next
    // 当前 Promise 完成后调用 then 再次调用 next
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    // 返回一个 Promise
    return new Promise(function (resolve, reject) {
      // 对象生成器对象
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      // 执行一次
      _next(undefined);
    });
  };
}

// 1 2 3 4
_asyncToGenerator(function* () {
  console.log(1);

  yield new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      console.log(2);
    });
  });

  yield new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      console.log(3);
    });
  });

  console.log(4);
})();

// Generator 的实现，内部实现复杂我们替换成 Generator。
// _asyncToGenerator(
//   /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
//     return regeneratorRuntime.wrap(function _callee$(_context) {
//       while (1) {
//         switch ((_context.prev = _context.next)) {
//           case 0:
//             console.log(1);
//             _context.next = 3;
//             return new Promise(function (resolve) {
//               setTimeout(function () {
//                 resolve();
//                 console.log(2);
//               });
//             });

//           case 3:
//             _context.next = 5;
//             return new Promise(function (resolve) {
//               setTimeout(function () {
//                 resolve();
//                 console.log(3);
//               });
//             });

//           case 5:
//             console.log(4);

//           case 6:
//           case "end":
//             return _context.stop();
//         }
//       }
//     }, _callee);
//   })
// )();
