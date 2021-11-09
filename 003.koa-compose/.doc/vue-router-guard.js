class VueRouter {
  guards = [];
  beforeEach(guard) {
    this.guards.push(guardToPromiseFn(guard));
  }
  run() {
    runGuardQueue(this.guards);
  }
}

const router = new VueRouter();
router.beforeEach((to, from, next) => {
  console.log(1);
  next();
});
router.beforeEach((to, from) => {
  console.log(2);
});

router.run(); // 1 -> 2

// 串行执行守卫
function runGuardQueue(guards) {
  // Promise.resolve().then(() => guard1()).then(() => guard2())
  // guard() 执行后返回的 Promise
  return guards.reduce(
    (promise, guard) => promise.then(() => guard()),
    Promise.resolve()
  );
}

// 把守卫包装成 Promise
function guardToPromiseFn(guard, to, from) {
  return () => {
    return new Promise((resolve, reject) => {
      // 定义 next ，当执行 next 的时候这个 Promise 才会从 pending -> resolve
      const next = () => resolve();
      // 执行守卫函数并把 next 函数传递过去
      guard(to, from, next);
      // 如果守卫函数没有定义 next，默认执行 next
      if (guard.length < 3) next();
    });
  };
}
