const co = require("../index");

// 1 2 3 4
co(function* () {
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
});
