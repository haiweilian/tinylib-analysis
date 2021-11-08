const recast = require("recast");
const isPkg = require("validate-npm-package-name");

function transformModuleImports(code) {
  // recast -> 字符串解析成 ast -> https://github.com/benjamn/recast
  const ast = recast.parse(code);
  recast.types.visit(ast, {
    // 遍历所有的 Import 声明语句
    visitImportDeclaration(path) {
      const source = path.node.source.value;
      // 处理 npm 包的路径， vue -> /__modules/vue
      if (!/^\.\/?/.test(source) && isPkg(source)) {
        // 替换 ast 节点中的值
        path.node.source = recast.types.builders.literal(
          `/__modules/${source}`
        );
      }
      this.traverse(path);
    }
  });
  // 最后再把 ast 转成成 代码字符串 返回
  return recast.print(ast).code;
}

exports.transformModuleImports = transformModuleImports;
