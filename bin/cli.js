#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const configFiles = ['default', 'development', 'production', 'test']

const template = `module.exports = {

};
`

fs.mkdirSync(path.join('.', 'config'))
fs.writeFileSync(
  './config/index.js',
  `const Config = require('hello-config');

module.exports = Config.load();
`
)

configFiles.forEach(env => {
  fs.writeFileSync(path.join('.', 'config', `${env}.js`), template)
})

process.exit(0)
