#!/usr/bin/env node

const chalk = require('chalk')
const fs = require('fs')
const debug = require('debug')('askmike:cli')

const getip = require('./lib/ip')
const cfgCheck = require('./lib/cfg-check')
const doczGen = require('./lib/docz-gen')

const dispatch = (target, opts) => {
  let errors = []
  switch (target) {
    case 'ip':
      const addresses = getip(opts)
      console.error(`IP Addresses: \n${addresses.join('\n')}`)
      break
    case 'cfg-check':
      errors = cfgCheck.checkAll(opts)
      // No output - command will do its own
      break
    case 'docz-gen':
      errors = doczGen.generate(opts)
      // No output - command will do its own
      break
    default:
      console.error("Please provide a command as a parameter, eg 'ip' or 'cfg-check', or 'docz-gen'")
      process.exit(1)
      break
  }
  return errors
}
var opts = require('minimist')(process.argv.slice(2))
// console.dir(opts)

const target = opts._[0]
let errors = []
errors = dispatch(target, opts)

// debug('errors', errors)
try {
  if (errors.length > 0) {
    process.exit(1)
  } else {
    debug(`${target}: ${chalk.green.inverse('ok')}`)
    // process.exit(0)
  }
} catch (e) {
  console.error('Exception', e)
  process.exit(1)
}
