#!/usr/bin/env node

const express = require('express')
const { vueMiddleware } = require('../middleware')

const app = express()
const root = process.cwd();

// 自定义中间件
app.use(vueMiddleware())

// 目录作为静态资源
app.use(express.static(root))

app.listen(3000, () => {
  console.log('server running at http://localhost:3000')
})
