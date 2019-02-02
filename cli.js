#!/usr/bin/env node

const chalk = require('chalk')
const fs = require('fs')
const debug = require('debug')('askmike')

const getip = require('./lib/ip')
const nabCheck = require('./lib/nab-check')

var opts = require('minimist')(process.argv.slice(2))
// console.dir(opts)

const target = opts._[0]
let errors = []

switch (target) {
  case 'ip':
    const addresses = getip(opts)
    console.log(`IP Addresses: \n${addresses.join('\n')}`)
    break
  case 'nab-check':
    errors = nabCheck(opts)
    // No output - command will do its own
    break
  default:
    console.log("Please provide a command as a parameter, eg 'ip' or 'nab-check'")
    break
}

// debug('errors', errors)
try {
  if (errors.length > 0) {
    // console.log(errors.join('\n'))
    debug('FAIL')
    process.exit(1)
  } else {
    debug('OK')
    debug(`${target}: ${chalk.green.inverse('ok')}`)
    process.exit(0)
  }
} catch (e) {
  console.error(e)
}
