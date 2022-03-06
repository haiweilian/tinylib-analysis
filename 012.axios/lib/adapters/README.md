# axios // adapters

`adapters/` 下的模块负责发送请求并在收到响应后处理返回的 `Promise` 。

## 实例

```js
var settle = require('./../core/settle');

module.exports = function myAdapter(config) {
  // 在此时：

  // - 配置已与默认配置合并
  // - 请求转换器已经执行
  // - 请求拦截器已经执行

  // 使用提供的配置发出请求
  // 根据响应来 settle Promise

  return new Promise(function (resolve, reject) {
    var response = {
      data: responseData,
      status: request.status,
      statusText: request.statusText,
      headers: responseHeaders,
      config: config,
      request: request
    };

    settle(resolve, reject, response);

    // 从这里开始:
    //  - 响应转换器开始执行
    //  - 响应拦截器开始执行
  });
}
```
