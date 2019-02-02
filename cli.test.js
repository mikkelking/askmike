#!/usr/bin/env node

const fs = require('fs')
const { execSync } = require('child_process')
const debug = require('debug')('test')

const nabCheck = require('./lib/nab-check')

const options = { stdio: 'inherit' }
const goodEnv = {
  http_proxy: 'http://proxy.nab.com.au:10091',
  https_proxy: 'http://proxy.nab.com.au:10091',
  no_proxy: '.thenational.com,.national.com.au'
}

const badEnv = {
  http_proxy: 'http://proxy.nab.com.au:8081',
  no_proxy: '.thenational.com,.nab.com.au'
}

test('Environment check ok', () => {
  Object.keys(goodEnv).forEach(key => {
    process.env[key] = goodEnv[key]
  })
  expect(nabCheck.envCheck()).toBeFalsy()
})

test('Environment check bad', () => {
  Object.keys(badEnv).forEach(key => {
    process.env[key] = badEnv[key]
  })
  expect(nabCheck.envCheck()).toBeTruthy()
})

test('rc check .goodrc', () => {
  expect(nabCheck.rcCheck('good')).toBeFalsy()
})

test('rc check .badrc', () => {
  expect(nabCheck.rcCheck('bad')).toBeTruthy()
})

// test('Prefix ok', () => {
//   const ENV = Object.keys(mandatoryEnv).reduce((acc, key) => {
//     return acc + `${key}=${mandatoryEnv[key]} `
//   }, '')
//   expect(execSync(`${ENV} node cli.js nab-check`, options)).toBeTruthy()
// })

// test('Prefix ok throw?', () => {
//   expect(() => {
//     execSync('node cli.js nab-check', options)
//   }).toThrow()
// })

// test('Invalid command', () => {
//   expect(() => {
//     execSync('node cli.js rubbish me please', options)
//   }).toThrow()
// })

// test('Prefix ', () => {
//   expect(() => {
//     execSync('NPM_prefix=BAD_THING node cli.js nab-check', options)
//   }).toThrow()
// })
