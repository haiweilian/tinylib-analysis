// 1 2 3 4
(async () => {
  console.log(1);

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      console.log(2);
    });
  });

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      console.log(3);
    });
  });

  console.log(4);
})();
