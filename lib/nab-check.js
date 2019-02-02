const chalk = require('chalk')
const fs = require('fs')

const PREFIX_EXPLAIN = chalk.blue('http://go/prefix')

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
    optional: false,
    '@nab:registry': 'https://artifactory. aus.thenational.com:443/api/npm/NPM-SHARED-build/'
  }

  const rc = require('rc')('npm', {})
  console.log(rc)
  if (rc.configs.length > 0) {
    console.log('.npmrc files read:', rc.configs)
  }
  if (rc.prefix) {
    console.warn(
      `${chalk.bgYellow.black('Detected an erroneous setting')} , "prefix=${
        rc.prefix
      }", this is probably not ideal, as you should be using ${chalk.green(
        'nvm'
      )}, see ${PREFIX_EXPLAIN} for more information`
    )
  }
  if (!rc.cafile) {
    console.error(`${chalk.bgRed('Missing cafile setting')}`)
  } else {
    if (!fs.existsSync(rc.cafile)) {
      console.error(`cafile ${rc.cafile} does not exist`)
    }
  }
  Object.keys(expected).forEach(key => {
    if (rc[key] !== expected[key]) {
      console.error(`${chalk.bgRed('Incorrect setting:')} ${key}=${rc[key]}, should be ${expected[key]}`)
    }
  })

  // const file = `${process.env.HOME}/.npmrc`
  // const lines = fs
  //   .readFileSync(file, { encoding: 'utf8' })
  //   .split('\n')
  //   .filter(line => !line.match(/^#/))
  // lines.forEach((line, ix) => {
  //   console.log(`${ix}: ${line}`)
  // })
  // console.log(`~/.npmrc: ${chalk.green.inverse('ok')}`)
}

const nabCheck = () => {
  console.log('Checking your stuff')

  envCheck()
  npmrcCheck()
}
module.exports = nabCheck
