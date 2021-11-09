const compose = require("../index");

class App {
  middlewares = [];
  use(fn) {
    this.middlewares.push(fn);
  }
  run() {
    compose(this.middlewares)();
  }
}

const app = new App();

app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(6);
});
app.use(async (ctx, next) => {
  console.log(2);
  await next();
  console.log(5);
});
app.use(async (ctx, next) => {
  console.log(3);
  await next();
  console.log(4);
});

app.run(); // 1->2->3->4->5->6
