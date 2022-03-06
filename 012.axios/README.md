# axios 源码分析

[![npm version](https://img.shields.io/npm/v/axios.svg?style=flat-square)](https://www.npmjs.org/package/axios)
[![CDNJS](https://img.shields.io/cdnjs/v/axios.svg?style=flat-square)](https://cdnjs.com/libraries/axios)
[![build status](https://img.shields.io/travis/axios/axios/master.svg?style=flat-square)](https://travis-ci.org/axios/axios)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/axios/axios)
[![code coverage](https://img.shields.io/coveralls/mzabriskie/axios.svg?style=flat-square)](https://coveralls.io/r/mzabriskie/axios)
[![install size](https://packagephobia.now.sh/badge?p=axios)](https://packagephobia.now.sh/result?p=axios)
[![npm downloads](https://img.shields.io/npm/dm/axios.svg?style=flat-square)](http://npm-stat.com/charts.html?package=axios)
[![gitter chat](https://img.shields.io/gitter/room/mzabriskie/axios.svg?style=flat-square)](https://gitter.im/mzabriskie/axios)
[![code helpers](https://www.codetriage.com/axios/axios/badges/users.svg)](https://www.codetriage.com/axios/axios)

基于 promise 的、可以用于浏览器和 node.js 的网络请求库

[新文档地址](https://axios-http.com) [原始代码地址](https://github.com/MageeLin/axios-source-code-analysis)

## 内容表

- [特性](#特性)
- [浏览器支持](#浏览器支持)
- [安装](#安装)
- [实例](#实例)
- [Axios API](#axios-api)
- [请求方法别名](#请求方法别名)
- [创建实例](#创建实例)
- [实例方法](#实例方法)
- [请求配置](#请求配置)
- [响应结构](#响应结构)
- [默认配置](#默认配置)
  - [全局默认配置](#全局默认配置)
  - [自定义实例默认配置](#自定义实例默认配置)
  - [配置的优先级](#配置的优先级)
- [拦截器](#拦截器)
- [错误处理](#错误处理)
- [取消请求](#取消请求)
- [请求体编码](#请求体编码)
  - [浏览器](#浏览器)
  - [Node.js](#nodejs)
    - [Query string](#query-string)
    - [Form data](#form-data)
- [版本号](#版本号)
- [Promises](#promises)
- [TypeScript](#typescript)
- [相关资源](#相关资源)
- [灵感](#灵感)
- [许可](#许可)

## 特性

- 在浏览器创建 [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- 在 node.js 创建 [http](http://nodejs.org/api/http.html) 请求
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 拦截请求和响应
- 转换请求和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御[XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)

## 浏览器支持

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Latest ✔                                                                                 | Latest ✔                                                                                    | Latest ✔                                                                                 | Latest ✔                                                                              | Latest ✔                                                                           | 11 ✔                                                                                                                         |

[![Browser Matrix](https://saucelabs.com/open_sauce/build_matrix/axios.svg)](https://saucelabs.com/u/axios)

## 安装

使用 npm:

```bash
$ npm install axios
```

使用 bower:

```bash
$ bower install axios
```

使用 yarn:

```bash
$ yarn add axios
```

使用 jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

使用 unpkg CDN:

```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

## 实例

### 注意: CommonJS 用法

为了在 CommonJS 中使用 `require（）` 导入时获得 TypeScript 类型推断（智能感知/自动完成），请使用以下方法：

```js
const axios = require("axios").default;

// axios.<method> 能够提供自动完成和参数类型推断功能
```

发起一个 `GET` 请求

```js
const axios = require("axios");

// 向给定ID的用户发起请求
axios
  .get("/user?ID=12345")
  .then(function (response) {
    // 处理 success 的情况
    console.log(response);
  })
  .catch(function (error) {
    // 处理 error 的情况
    console.log(error);
  })
  .then(function () {
    // 总是会执行
  });

// 上述请求也可以按以下方式完成（可选）
axios
  .get("/user", {
    params: {
      ID: 12345,
    },
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // 总是会执行
  });

// 想使用 async/await? 在外层函数前添加 `async` 关键字
async function getUser() {
  try {
    const response = await axios.get("/user?ID=12345");
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

> **注意:** 由于`async/await` 是 ECMAScript 2017 中的一部分，而且在 IE 和一些旧的浏览器中不支持，所以使用时务必要小心。

发起一个 `POST` 请求

```js
axios
  .post("/user", {
    firstName: "Fred",
    lastName: "Flintstone",
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

发起多个并发请求

```js
function getUserAccount() {
  return axios.get("/user/12345");
}

function getUserPermissions() {
  return axios.get("/user/12345/permissions");
}

Promise.all([getUserAccount(), getUserPermissions()]).then(function (results) {
  const acct = results[0];
  const perm = results[1];
});
```

## axios API

可以向 `axios` 传递相关配置来创建请求

##### axios(config)

```js
// 发起一个 POST 请求
axios({
  method: "post",
  url: "/user/12345",
  data: {
    firstName: "Fred",
    lastName: "Flintstone",
  },
});
```

```js
// 在 node.js 用 GET 请求获取远程图片
axios({
  method: "get",
  url: "http://bit.ly/2mTM3nY",
  responseType: "stream",
}).then(function (response) {
  response.data.pipe(fs.createWriteStream("ada_lovelace.jpg"));
});
```

##### axios(url[, config])

```js
// 发起一个 GET 请求 (默认请求方式)
axios("/user/12345");
```

### 请求方法别名

为了方便起见，已经为所有支持的请求方法提供了别名。

##### axios.request(config)

##### axios.get(url[, config])

##### axios.delete(url[, config])

##### axios.head(url[, config])

##### axios.options(url[, config])

##### axios.post(url[, data[, config]])

##### axios.put(url[, data[, config]])

##### axios.patch(url[, data[, config]])

###### 注意

在使用别名方法时， 配置中`url`、`method`、`data` 这些属性都不必指定。

### 创建一个实例

你可以使用自定义配置新建一个实例。

##### axios.create([config])

```js
const instance = axios.create({
  baseURL: "https://some-domain.com/api/",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});
```

### 实例方法

以下是可用的实例方法。新指定的配置将与上述实例的配置合并。

##### axios#request(config)

##### axios#get(url[, config])

##### axios#delete(url[, config])

##### axios#head(url[, config])

##### axios#options(url[, config])

##### axios#post(url[, data[, config]])

##### axios#put(url[, data[, config]])

##### axios#patch(url[, data[, config]])

##### axios#getUri([config])

## 请求配置

以下是创建请求时可以用的配置选项。只有 `url` 是必需的。如果没有指定 `method`，请求将默认使用 `GET` 方法。

```js
{
  // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get', // 默认值

  // 除非 `url` 是一个绝对 URL，否则 `baseURL` 将自动加在 `url` 前面，
  // 所以可以通过设置一个 `baseURL`，便于为 axios 实例的方法只传递相对 URL 路径即可
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` 允许在向服务器发送请求前修改请求数据
  // 只在 'PUT', 'POST', 'PATCH' 和 'DELETE' 这几个请求方法中生效
  // 数组中最后一个函数必须返回一个字符串、 Buffer实例、ArrayBuffer、FormData 或 Stream
  // 也可以可以修改请求头对象。
  transformRequest: [function (data, headers) {
    // 对发送的 data 进行任意转换处理

    return data;
  }],

  // `transformResponse` 允许在传递结果给 then/catch 前修改响应数据
  transformResponse: [function (data) {
    // 对接收的 data 进行任意转换处理

    return data;
  }],

  // 自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 是与请求一起发送的 URL 参数
  // 必须是一个简单对象或 URLSearchParams 对象
  params: {
    ID: 12345
  },

  // `paramsSerializer`是可选的、用于序列化`params`的方法
  // (例如 https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` 是发送数据的请求体
  // 仅适用 'PUT', 'POST', 'DELETE 和 'PATCH' 请求方法
  // 在没有设置 `transformRequest` 时，则必须是以下类型之一:
  // - 字符串, 简单对象, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属: FormData, File, Blob
  // - Node 专属: Stream, Buffer
  data: {
    firstName: 'Fred'
  },

  // 发送请求体数据的可选语法
  // 请求方式 POST
  // 只有 value 会被发送，key 不会被发送
  data: 'Country=Brasil&City=Belo Horizonte',

  // `timeout` 指定请求超时的毫秒数。
  // 如果请求时间超过 `timeout` 的值，则请求会被中断
  timeout: 1000, // 默认值是 `0` (永不超时)

  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // 默认false

  // `adapter` 允许自定义处理请求，使测试过程更容易。
  // 返回一个 promise 并提供一个有效的响应 （参见 lib/adapters/README.md）。
  adapter: function (config) {
    /* ... */
  },

  // `auth` 表示应该使用 HTTP 基本验证方案，并提供凭证。
  // 这将设置一个 `Authorization` 请求头，覆盖任何使用 `headers` 设置的现有的`Authorization` 自定义请求头。
  // 请注意，只有 HTTP 基本验证方案才可通过此参数进行配置。
  // 对于 Bearer tokens 等验证方案，请改用`Authorization`自定义请求头。
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // `responseType` 表示浏览器将要响应的数据类型
  // 选项包括:  'arraybuffer', 'document', 'json', 'text', 'stream'
  // 浏览器专属： 'blob'
  responseType: 'json', // 默认值

  // `responseEncoding` 表示用于解码响应的编码 (Node.js 专属)
  // 注意：`responseType` 的值为 'stream' 的请求和浏览器端的请求会被忽略掉编码格式
  responseEncoding: 'utf8', // 默认值

  // `xsrfCookieName` 是被用作 xsrf token 值的 cookie 的名
  xsrfCookieName: 'XSRF-TOKEN', // 默认值

  // `xsrfHeaderName` 是带有 xsrf token 值的 http 请求头的名
  xsrfHeaderName: 'X-XSRF-TOKEN', // 默认值

  // `onUploadProgress` 允许为`上传`处理进度事件
  // 浏览器专属
  onUploadProgress: function (progressEvent) {
    // 处理原生进度事件
  },

  // `onDownloadProgress` 允许为`下载`处理进度事件
  // 浏览器专属
  onDownloadProgress: function (progressEvent) {
    // 处理原生进度事件
  },

  // `maxContentLength` 定义了 node.js 中允许的 HTTP 响应内容的最大字节数
  maxContentLength: 2000,

  // `maxBodyLength`（仅Node）定义允许的 HTTP 请求内容的最大字节数
  maxBodyLength: 2000,

  // `validateStatus` 定义了对于给定的 HTTP 状态码是定义为 resolve 还是 reject promise。
  // 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，
  // 则 promise 将会 resolved，否则是 rejected。
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  },

  // `maxRedirects` 定义了在 node.js 中的最大重定向数。
  // 如果设置为 0，则不会进行重定向
  maxRedirects: 5, // 默认值

  // `socketPath` 定义了在 node.js 中使用的 UNIX Socket。
  // 例如 '/var/run/docker.sock' 发送请求到 docker 守护进程。
  // 只能指定 `socketPath` 或 `proxy` 中的一个。若都指定，则优先使用 `socketPath` 。
  socketPath: null, // default

  // `httpAgent` 和 `httpsAgent` 分别定义了在 node.js 中执行 http 和 https 请求时要使用的自定义代理。
  // 允许添加默认情况下未启用的选项，如`keepAlive`。
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // `proxy` 定义了代理服务器的主机名，端口和协议。
  // 你也可以使用传统的的 `http_proxy` 和 `https_proxy` 环境变量。如果在代理配置中使用环境变量，还可以将 `no_proxy` 环境变量定义为不应代理的域名的逗号分隔列表。
  // 使用 `false` 可以禁用代理功能，同时环境变量也会被忽略。
  // `auth`表示应使用 HTTP Basic auth 连接到代理，并且提供凭据。这将设置一个 `Proxy-Authorization` 请求头，会覆盖 `headers` 中已存在的自定义 `Proxy-Authorization` 请求头。
  // 如果代理服务器使用 HTTPS，则必须设置 protocol 为`https`
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // `cancelToken` 指定可用于取消请求的cancel Token
  //（有关详细信息，请参阅下面的`Cancellation`章节）
  cancelToken: new CancelToken(function (cancel) {
  }),

  // `decompress` 指示是否应该对响应体进行自动解压。如果设置为 `true` 也将删除掉所有来自被解压的响应对象的'content-encoding'请求头
  // 仅限Node.js（XHR 无法关闭自动解压）
  decompress: true // 默认值

  // 可能会在较新版本中删除的向后兼容性过渡选项
  transitional: {
    // 静默JSON解析模式
    // `true`  - 忽略JSON解析错误，并且解析失败时设置response.data为null（旧行为）
    // `false` - 当JSON解析失败时，抛出一个SyntaxError（注意：responseType必须设置为'json'）
    silentJSONParsing: true; // 当前Axios版本的默认值

    // 不是 'json'，也试图去用JSON的方式来解析响应字符串
    forcedJSONParsing: true;

    // 在请求超时时抛出 ETIMEDOUT 错误而不是通用的 ECONNABORTED
    clarifyTimeoutError: false;
  }
}
```

## 响应结构

一个请求的响应包含以下信息。

```js
{
  // `data` 是由服务器提供的响应
  data: {},

  // `status` 是来自服务器响应的 HTTP 状态码
  status: 200,

  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',

  // `headers` 是服务器 HTTP 响应的响应头
  // 所有的 header 名都是小写，而且可以使用方括号语法访问
  // 例如: `response.headers['content-type']`
  headers: {},

  // `config` 是 `axios` 请求的配置信息
  config: {},

  // `request` 是生成此响应的请求
  // 在 node.js 中它是最后一个 ClientRequest 实例 (in redirects)，
  // 在浏览器中则是 XMLHttpRequest 实例
  request: {}
}
```

当使用 `then` 时，将接收如下响应:

```js
axios.get("/user/12345").then(function (response) {
  console.log(response.data);
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.headers);
  console.log(response.config);
});
```

当使用 `catch`，或者传递一个 [rejection callback ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) 作为 `then` 的第二个参数时，响应可以通过 `error` 对象来获得，详情请见 [错误处理](https://axios-http.com/zh/docs/handling_errors) 章节。

## 默认配置

你可以指定默认配置，它将作用于每个请求中。

### 全局默认值

```js
axios.defaults.baseURL = "https://api.example.com";

// 重要： 如果axios被用于多个域名中，AUTH_TOKEN 将发送给所有的域名
// 如下面的实例所示，使用自定义实例默认值来代替全局默认值
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
```

### 自定义实例默认值

```js
// 创建实例时配置默认值
const instance = axios.create({
  baseURL: "https://api.example.com",
});

// 创建实例后修改默认值
instance.defaults.headers.common["Authorization"] = AUTH_TOKEN;
```

### 配置的优先级

配置将会按优先级进行合并。优先级顺序如下：在 [lib/defaults.js](https://github.com/axios/axios/blob/master/lib/defaults.js#L28) 中找到的库默认值，然后是实例的 `defaults` 属性，最后是请求的 `config` 参数。后面的优先级要高于前面的。下面有一个实例。

```js
// 使用库提供的默认配置创建实例，此时超时配置的默认值是 `0`
const instance = axios.create();

// 重写库的超时默认值
// 现在，所有使用此实例的请求都将等待2.5秒，然后才会超时
instance.defaults.timeout = 2500;

// 因为该请求需要很长时间，所以重写此请求的超时时间。
instance.get("/longRequest", {
  timeout: 5000,
});
```

## 拦截器

在请求或响应被 then 或 catch 处理前拦截它们。

```js
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前对配置项修改
    return config;
  },
  function (error) {
    // 请求报错时进行处理
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数
    // 统一处理响应数据
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数
    // 响应报错时进行处理
    return Promise.reject(error);
  }
);
```

如果稍后需要移除拦截器，可以如下所示：

```js
const myInterceptor = axios.interceptors.request.use(function () {
  /*...*/
});
axios.interceptors.request.eject(myInterceptor);
```

可以给自定义的 axios 实例添加拦截器。

```js
const instance = axios.create();
instance.interceptors.request.use(function () {
  /*...*/
});
```

当添加请求拦截器时，默认情况下它们为异步执行。所以当主线程被阻塞时，可能会导致 axios 请求的延迟执行（在后台为拦截器创建了一个 promise，并且被放在调用堆栈的底部）。如果想让请求拦截器同步执行，可以向 options 对象添加一个 synchronous 标志，该标志将使 axios 同步运行代码并避免请求执行中的任何延迟。

```js
axios.interceptors.request.use(
  function (config) {
    config.headers.test = "I am only a header!";
    return config;
  },
  null,
  { synchronous: true }
);
```

如果想要基于运行时检查来执行特定拦截器，可以向 options 对象添加一个 `runWhen` 函数。 **当且仅当** `runWhen` 的返回值为 `true` 时，拦截器才会被执行。该函数将调用 config 对象（也可以将自定义的参数绑定）。当只需要在特定规则下运行的异步请求拦截器时，这会很方便。

```js
function onGetCall(config) {
  return config.method === "get";
}
axios.interceptors.request.use(
  function (config) {
    config.headers.test = "special get headers";
    return config;
  },
  null,
  { runWhen: onGetCall }
);
```

## 错误处理

```js
axios.get("/user/12345").catch(function (error) {
  if (error.response) {
    // 请求成功发出且服务器也响应了状态码，但状态码超出了 2xx 的范围
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // 请求已经成功发出，但没有收到响应
    // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
    // 而在 node.js 中是 http.ClientRequest 的实例
    console.log(error.request);
  } else {
    // 建立请求时触发了错误
    console.log("Error", error.message);
  }
  console.log(error.config);
});
```

使用 `validateStatus` 配置选项，可以自定义什么样的 HTTP code 会抛出错误。

```js
axios.get("/user/12345", {
  validateStatus: function (status) {
    return status < 500; // 只处理状态码小于500的情况
  },
});
```

使用 `toJSON` 可以获取更多关于 HTTP 错误的信息。

```js
axios.get("/user/12345").catch(function (error) {
  console.log(error.toJSON());
});
```

## 取消请求

使用 _cancel token_ 可以取消一个请求。

> Axios 的 cancel token API 是基于 [cancelable promises proposal](https://github.com/tc39/proposal-cancelable-promises) 提案。

可以使用 `CancelToken.source` 工厂方法创建一个 cancel token ，如下所示：

```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios
  .get("/user/12345", {
    cancelToken: source.token,
  })
  .catch(function (thrown) {
    if (axios.isCancel(thrown)) {
      console.log("Request canceled", thrown.message);
    } else {
      // 处理错误
    }
  });

axios.post(
  "/user/12345",
  {
    name: "new name",
  },
  {
    cancelToken: source.token,
  }
);

// 取消请求（message 参数是可选的）
source.cancel("Operation canceled by the user.");
```

也可以通过给 `CancelToken` 的构造函数传递一个 executor 函数参数来创建一个 cancel token：

```js
const CancelToken = axios.CancelToken;
let cancel;

axios.get("/user/12345", {
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c;
  }),
});

// 取消请求
cancel();
```

> 注意: 可以使用同一个 cancel token 取消多个请求。
> 如果在发送 Axios 请求时已经取消了 cancel token，则该请求会立即取消，而不会尝试发出任何实际请求。

## 请求体编码

默认情况下，axios 将 JavaScript 对象序列化为 `JSON` 格式 。 如果要换成`application/x-www-form-urlencoded`格式发送数据，可以使用以下选项之一。

### 浏览器

在浏览器中，可以使用[`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) API，如下所示：

```js
const params = new URLSearchParams();
params.append("param1", "value1");
params.append("param2", "value2");
axios.post("/foo", params);
```

> 请注意，不是所有的浏览器(参见 [caniuse.com](http://www.caniuse.com/#feat=urlsearchparams))都支持 `URLSearchParams` ，但是可以使用[polyfill](https://github.com/WebReflection/url-search-params) (确保 polyfill 在全局环境生效)

或者可以使用[`qs`](https://github.com/ljharb/qs) 库编码数据:

```js
const qs = require("qs");
axios.post("/foo", qs.stringify({ bar: 123 }));
```

或者用另一种方式 (ES6)：

```js
import qs from "qs";
const data = { bar: 123 };
const options = {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  data: qs.stringify(data),
  url,
};
axios(options);
```

### Node.js

#### Query string

在 node.js 中， 可以使用 [`querystring`](https://nodejs.org/api/querystring.html) 模块，如下所示:

```js
const querystring = require("querystring");
axios.post("http://something.com/", querystring.stringify({ foo: "bar" }));
```

或者从['url 模块'](https://nodejs.org/api/url.html)中使用['URLSearchParams'](https://nodejs.org/api/url.html#url_class_urlsearchparams)，如下所示:

```js
const url = require("url");
const params = new url.URLSearchParams({ foo: "bar" });
axios.post("http://something.com/", params.toString());
```

也可以使用 [`qs`](https://github.com/ljharb/qs) 库。

###### 注意

如果需要对嵌套对象进行字符串化处理，则最好使用 `qs` 库，因为 querystring 方法在该用例中存在已知问题(https://github.com/nodejs/node-v0.x-archive/issues/1665)。

#### Form data

在 node.js 中可以使用 [`form-data`](https://github.com/form-data/form-data) 库，如下所示:

```js
const FormData = require("form-data");

const form = new FormData();
form.append("my_field", "my value");
form.append("my_buffer", new Buffer(10));
form.append("my_file", fs.createReadStream("/foo/bar.jpg"));

axios.post("https://example.com", form, { headers: form.getHeaders() });
```

或者使用一个拦截器:

```js
axios.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    Object.assign(config.headers, config.data.getHeaders());
  }
  return config;
});
```

## 版本号

在 axios 发布 `1.0` 版本之前，不兼容的 API 更改将随新的次要版本一起发布。例如`0.5.1`和`0.5.4`将具有相同的 API，但`0.6.0`会有向后不兼容的 API 变化。

## Promises

axios 依赖于原生的 ES6 Promise 实现[支持](http://caniuse.com/promises)。如果你的环境不支持 ES6 Promises，可以使用 [polyfill](https://github.com/jakearchibald/es6-promise)来兼容。

## TypeScript

axios 包含了 [TypeScript](http://typescriptlang.org) 类型定义和 axios errors 的类型守卫。

```typescript
let user: User = null;
try {
  const { data } = await axios.get("/user?ID=12345");
  user = data.userDetails;
} catch (error) {
  if (axios.isAxiosError(error)) {
    handleAxiosError(error);
  } else {
    handleUnexpectedError(error);
  }
}
```

## 在线一键安装

你可以使用 Gitpod （一个在线的开源免费的 IDE）来对项目进行贡献或运行实例。

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/axios/axios/blob/master/examples/server.js)

## 资源

- [变更日志](https://github.com/axios/axios/blob/master/CHANGELOG.md)
- [升级指南](https://github.com/axios/axios/blob/master/UPGRADE_GUIDE.md)
- [生态环境](https://github.com/axios/axios/blob/master/ECOSYSTEM.md)
- [贡献指南](https://github.com/axios/axios/blob/master/CONTRIBUTING.md)
- [编码规范](https://github.com/axios/axios/blob/master/CODE_OF_CONDUCT.md)

## 灵感

axios 深受 [Angular](https://angularjs.org/) 中提供的 [$http 服务](https://docs.angularjs.org/api/ng/service/$http) 的启发。axios 致力于提供一个独立的、在 Angular 之外使用的、类似 $http 的服务。

## 许可

[MIT](LICENSE)
