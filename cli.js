#!/usr/bin/env node

const chalk = require('chalk')
const fs = require('fs')

const getip = require('./lib/ip')
const nabCheck = require('./lib/nab-check')

var opts = require('minimist')(process.argv.slice(2))
// console.dir(opts)

const target = opts._[0]

switch (target) {
  case 'ip':
    const addresses = getip(opts)
    console.log(`IP Addresses: \n${addresses.join('\n')}`)
    break
  case 'nab-check':
    nabCheck(opts)
    // No output - command will do its own
    break
  default:
    console.log("Please provide a command as a parameter, eg 'ip' or 'nab-check'")
    break
}
