const { sync } = require('glob')
const { Router } = require('express')
const { chain } = require('lodash')

module.exports = () => chain(sync('**/*.js', {
  cwd: __dirname,
  ignore: ['**/*.test.js','**/__snapshots__/*'],
}))
  .map(filename => require(`./${filename}`))
  .filter(router => Object.getPrototypeOf(router) == Router)
  .reduce((rootRouter, router) => rootRouter.use(router), Router({ mergeParams: true }))
  .value()
