# 指南

这里有一些常用功能的指南。

为了让 axios 尽可能轻量级，通常需要拒绝各种合并请求。许多功能都可以通过使用其他库扩充 axios 来支持。

### Promise.prototype.done

```bash
$ npm install axios promise --save
```

```js
const axios = require('axios');
require('promise/polyfill-done');

axios
  .get('http://www.example.com/user')
  .then((response) => {
    console.log(response.data);
    return response;
  })
  .done();
```

### Promise.prototype.finally

```bash
$ npm install axios promise.prototype.finally --save
```

```js
const axios = require('axios');
require('promise.prototype.finally').shim();

axios
  .get('http://www.example.com/user')
  .then((response) => {
    console.log(response.data);
    return response;
  })
  .finally(() => {
    console.log('本行一直会被调用');
  });
```

### Inflate/Deflate

```bash
$ npm install axios pako --save
```

```js
// client.js
const axios = require('axios');
const pako = require('pako');

const user = {
  firstName: 'Fred',
  lastName: 'Flintstone'
};

const data = pako.deflate(JSON.stringify(user), { to: 'string' });

axios
  .post('http://127.0.0.1:3333/user', data)
  .then((response) => {
    response.data = JSON.parse(pako.inflate(response.data, { to: 'string' }));
    console.log(response.data);
    return response;
  });
```

```js
// server.js
const pako = require('pako');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  req.setEncoding('utf8');

  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  if (pathname === '/user') {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      const user = JSON.parse(pako.inflate(data, { to: 'string' }));
      console.log(user);

      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(pako.deflate(JSON.stringify({result: 'success'}), { to: 'string' }));
    });
  } else {
    res.writeHead(404);
    res.end(pako.deflate(JSON.stringify({result: 'error'}), { to: 'string' }));
  }
});

server.listen(3333);
```

### JSONP

```bash
$ npm install jsonp --save
```

```js
const jsonp = require('jsonp');

jsonp('http://www.example.com/foo', null, (err, data) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(data);
  }
});
```
