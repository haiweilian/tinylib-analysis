const vueCompiler = require("@vue/component-compiler");
const fs = require("fs");
const stat = require("util").promisify(fs.stat);
const root = process.cwd();
const path = require("path");
const parseUrl = require("parseurl");
const { transformModuleImports } = require("./transformModuleImports");
const { loadPkg } = require("./loadPkg");
const { readSource } = require("./readSource");

const defaultOptions = {
  cache: true
};

const vueMiddleware = (options = defaultOptions) => {
  // 缓存配置：LRU 最近最久未使用
  // https://github.com/isaacs/node-lru-cache
  let cache;
  let time = {};
  if (options.cache) {
    const LRU = require("lru-cache");

    cache = new LRU({
      max: 500,
      length: function(n, key) {
        return n * 2 + key.length;
      }
    });
  }

  // vue 的编译器模块
  const compiler = vueCompiler.createDefaultCompiler();

  function send(res, source, mime) {
    res.setHeader("Content-Type", mime);
    res.end(source);
  }

  function injectSourceMapToBlock(block, lang) {
    const map = Base64.toBase64(JSON.stringify(block.map));
    let mapInject;

    switch (lang) {
      case "js":
        mapInject = `//# sourceMappingURL=data:application/json;base64,${map}\n`;
        break;
      case "css":
        mapInject = `/*# sourceMappingURL=data:application/json;base64,${map}*/\n`;
        break;
      default:
        break;
    }

    return {
      ...block,
      code: mapInject + block.code
    };
  }

  function injectSourceMapToScript(script) {
    return injectSourceMapToBlock(script, "js");
  }

  function injectSourceMapsToStyles(styles) {
    return styles.map(style => injectSourceMapToBlock(style, "css"));
  }

  // 判断是否缓存
  async function tryCache(key, checkUpdateTime = true) {
    const data = cache.get(key);

    if (checkUpdateTime) {
      const cacheUpdateTime = time[key];
      const fileUpdateTime = (await stat(
        path.resolve(root, key.replace(/^\//, ""))
      )).mtime.getTime();
      if (cacheUpdateTime < fileUpdateTime) return null;
    }

    return data;
  }

  // 添加缓存
  function cacheData(key, data, updateTime) {
    const old = cache.peek(key);

    if (old != data) {
      cache.set(key, data);
      if (updateTime) time[key] = updateTime;
      return true;
    } else return false;
  }

  // vue SFC 编译
  async function bundleSFC(req) {
    const { filepath, source, updateTime } = await readSource(req);
    const descriptorResult = compiler.compileToDescriptor(filepath, source);
    const assembledResult = vueCompiler.assemble(compiler, filepath, {
      ...descriptorResult,
      script: injectSourceMapToScript(descriptorResult.script),
      styles: injectSourceMapsToStyles(descriptorResult.styles)
    });
    return { ...assembledResult, updateTime };
  }

  return async (req, res, next) => {
    if (req.path.endsWith(".vue")) {
      const key = parseUrl(req).pathname;
      let out = await tryCache(key);

      if (!out) {
        // 把单文件组件编译成 render 函数
        const result = await bundleSFC(req);
        out = result;
        cacheData(key, out, result.updateTime);
      }

      // 让浏览器用 JavaScript 引擎解析。
      // 小知识：浏览器不通过后缀名判断文件类型 https://es6.ruanyifeng.com/#docs/proposals#JSON-%E6%A8%A1%E5%9D%97
      send(res, out.code, "application/javascript");
    } else if (req.path.endsWith(".js")) {
      // 当前 js 开头，这里指 main.js 入口
      const key = parseUrl(req).pathname;

      // 是否存在缓存中，不存在解析文件
      let out = await tryCache(key);
      if (!out) {
        // transform import statements
        // 读取文件内容并转换 import 语句，最后在加入缓存
        const result = await readSource(req);
        out = transformModuleImports(result.source);
        cacheData(key, out, result.updateTime);
      }

      // 返回文件
      send(res, out, "application/javascript");
    } else if (req.path.startsWith("/__modules/")) {
      // 当是 __modules 开头的时候，证明是 npm 包，从 node_modules 读取，在返回文件
      const key = parseUrl(req).pathname;
      const pkg = req.path.replace(/^\/__modules\//, "");

      let out = await tryCache(key, false); // Do not outdate modules
      if (!out) {
        // 读取包内容返回
        out = (await loadPkg(pkg)).toString();
        cacheData(key, out, false); // Do not outdate modules
      }

      // 返回文件
      send(res, out, "application/javascript");
    } else {
      next();
    }
  };
};

exports.vueMiddleware = vueMiddleware;
