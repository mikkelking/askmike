#!/usr/bin/env node

const fs = require('fs')
const { execSync } = require('child_process')

test('Prefix ok', () => {
  expect(() => {
    execSync('node cli.js nab-check')
  }).toThrow()
})

test('Prefix ', () => {
  expect(() => {
    execSync('NPM_prefix=BAD_THING node cli.js nab-check')
  }).toThrow()
})
