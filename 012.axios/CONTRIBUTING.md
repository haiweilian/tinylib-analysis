# 贡献

我们对社区所做的任何贡献都持有开放态度并表示感谢。为 axios 做出贡献时，你应遵守 [行为准则](https://github.com/axios/axios/blob/master/CODE_OF_CONDUCT.md)。

### 代码样式

请遵守 [node style guide](https://github.com/felixge/node-style-guide).

### Commit 格式

Commit 消息应该是基于动词开头的，使用以下模式：

- `Fixing ...`
- `Adding ...`
- `Updating ...`
- `Removing ...`

### 测试

请更新测试内容来展示你的代码更改。如果PR在 [Travis CI](https://travis-ci.org/axios/axios) 上失败了，则该PR不会被接受。

### 文档

请对应地更新 [说明文档](README.md)，使 API 和文档之间没有差异。

### 开发

- `grunt test` 运行 jasmine 和 mocha 测试
- `grunt build` 运行 webpack 并打包源码
- `grunt version` 准备发布代码
- `grunt watch:test` 观察变化并运行 `test`
- `grunt watch:build` 监视更改并运行 `build`

请不要在你的PR中包含对 `dist/` 目录的更改。该目录应该只在发布新版本时更新。

### 发布

发布新版本时大多数步骤是自动化的。但目前 [CHANGELOG](https://github.com/axios/axios/blob/master/CHANGELOG.md) 需要手动更新。完成操作后，运行以下命令。版本应遵循 [语义版本控制](http://semver.org/)。

- `npm version <newversion> -m "Releasing %s"`
- `npm publish`

### 运行实例

实例允许手动进行测试。

运行实例

```bash
$ npm run examples
# Open 127.0.0.1:3000
```

在浏览器中运行沙箱

```bash
$ npm start
# Open 127.0.0.1:3000
```

在终端中运行沙箱

```bash
$ npm start
$ node ./sandbox/client
```
