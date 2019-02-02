const chalk = require('chalk')
const fs = require('fs')
const debug = require('debug')('askmike')

const PREFIX_EXPLAIN = chalk.blue('http://go/prefix')
const NODE_MIN_VERSION = 'v8.11.4'

const envCheck = () => {
  const mandatoryEnv = {
    http_proxy: 'http://proxy.nab.com.au:10091',
    https_proxy: 'http://proxy.nab.com.au:10091',
    no_proxy: '.thenational.com,.national.com.au'
  }
  const missing = Object.keys(mandatoryEnv).reduce((acc, item) => {
    if (process.env[item] !== mandatoryEnv[item]) {
      if (!acc) {
        acc = {}
      }
      acc[item] = mandatoryEnv[item]
    }
    return acc
  }, null)
  if (missing) {
    const what = Object.keys(missing)
      .map(item => ` ${item}="${missing[item]}"`)
      .join('\n')
    console.log(`${chalk.bgRed.yellow('Missing Environment variables:')} \n${chalk.yellow(what)}`)
  } else {
    console.log(`Environment variables: ${chalk.green.inverse('ok')}`)
  }
}

npmrcCheck = () => {
  const expected = {
    'strict-ssl': false,
    optional: false,
    '@nab:registry': 'https://artifactory.aus.thenational.com:443/api/npm/NPM-SHARED-build/'
  }

  const rc = require('rc')('npm', {})
  const errors = []
  debug('.npmrc files found:', rc.configs)
  // debug(rc)
  if (rc.prefix) {
    errors.push(
      `${chalk.bgYellow.black('Detected an erroneous setting')} , "prefix=${
        rc.prefix
      }", this is probably not ideal, as you should be using ${chalk.green(
        'nvm'
      )}, see ${PREFIX_EXPLAIN} for more information`
    )
  }
  if (!rc.cafile) {
    errors.push(`${chalk.bgRed('Missing cafile setting')}`)
  } else {
    if (!fs.existsSync(rc.cafile)) {
      errors.push(`cafile ${rc.cafile} does not exist`)
    }
  }
  Object.keys(expected).forEach(key => {
    if (rc[key] !== expected[key]) {
      errors.push(`${chalk.bgRed('Incorrect setting:')} ${key}=${rc[key]}, should be ${expected[key]}`)
    }
  })
  if (errors.length) {
    console.log(errors.join('\n'))
  } else {
    console.log(`.npmrc settings: ${chalk.green.inverse('ok')}`)
  }
  return errors
}

const nabCheck = () => {
  debug('Checking your stuff')
  if (process.version < NODE_MIN_VERSION) {
    console.error(`Your version of node ($process.version) is too old, you need at least ${NODE_MIN_VERSION}`)
  } else {
    console.log(`Node version: ${process.version} ${chalk.green.inverse('ok')}`)
  }

  envCheck()
  return npmrcCheck()
}

module.exports = nabCheck
