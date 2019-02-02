#!/usr/bin/env node

const fs = require('fs')
const { execSync } = require('child_process')
const debug = require('debug')('test')

const cfgCheck = require('./lib/cfg-check')
const settings = require('./lib/settings')

const options = { stdio: 'inherit' }
const goodEnv = settings.env

const badEnv = {
  http_proxy: 'http://proxy.bogus.com.au:8081',
  no_proxy: '.thebogus.com,.bogus.com.au'
}

test('Environment check ok', () => {
  Object.keys(goodEnv).forEach(key => {
    process.env[key] = goodEnv[key]
  })
  expect(cfgCheck.envCheck()).toBeFalsy()
})

test('Environment check bad', () => {
  Object.keys(badEnv).forEach(key => {
    process.env[key] = badEnv[key]
  })
  expect(cfgCheck.envCheck()).toBeTruthy()
})

test('rc check .goodrc', () => {
  expect(cfgCheck.rcCheck('good')).toBeFalsy()
})

test('rc check .badrc', () => {
  expect(cfgCheck.rcCheck('bad')).toBeTruthy()
})

// CLI based testing doesn't appear to be reliable,
// and also we can't control the config... so leave it be for now
// test('Prefix ok', () => {
//   const ENV = Object.keys(goodEnv).reduce((acc, key) => {
//     return acc + `${key}=${goodEnv[key]} `
//   }, '')
//   expect(execSync(`${ENV} node cli.js cfg-check`, options)).toThrow()
// })

// test('Prefix ok throw?', () => {
//   expect(() => {
//     execSync('node cli.js cfg-check', options)
//   }).toThrow()
// })

// test('Invalid command', () => {
//   expect(() => {
//     execSync('node cli.js rubbish me please', options)
//   }).toThrow()
// })

// test('Prefix ', () => {
//   expect(() => {
//     execSync('NPM_prefix=BAD_THING node cli.js cfg-check', options)
//   }).toThrow()
// })
