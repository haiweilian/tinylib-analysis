// 1 2 3 4
function* gen() {
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
}

// 对象生成器对象
let g = gen();

// 1、执行一步 输出 1
// 2、返回 Promise，成功后执行 then，输出 2
// g.next().value.then(() => {
//   // 3、再执行一步，返回 Promise，成功后执行 then，输出 3
//   g.next().value.then(() => {
//     // 4、再执行一步，结束 输出 4
//     g.next();
//   });
// });

next();
function next(res) {
  let ret = g.next(res);
  if (ret.done) return;
  // 上个完成后继续调用 next
  ret.value.then(() => {
    next(res);
  });
}
