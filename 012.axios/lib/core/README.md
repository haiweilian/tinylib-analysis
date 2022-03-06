# axios // core

`core/` 中的模块是特定于 axios 内部使用的模块。因为它们的逻辑特定于专门情况，所以在 axios 模块之外使用这些模块很可能没有用。core模块的一些例子如下：

- 调度请求
  - 通过 `adapters/` 发送的请求（参见 lib/adapters/README.md）

- 管理拦截器

- 处理配置
