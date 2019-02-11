const chalk = require('chalk')
const fs = require('fs')
const recursive = require('recursive-readdir')
const debug = require('debug')('askmike:docz')

const settings = require('./settings')

const PREFIX_EXPLAIN = chalk.blue('http://go/prefix')

const doit = async opts => {
  const tdir = opts._[1]
  debug('Generating .mdx files for Docz from directory:', tdir)
  try {
    const files = await recursive(tdir, [])
    // Files is an array of filename
    debug('Files to process: ', files)
    files.forEach(f => {
      const parts = f.split(/\//)
      const filename = parts.pop()
      // Not interest in tests/stories
      if (!/test|stories/i.test(f)) {
        if (filename.match(/.[jt]s[x]*$/i)) {
          console.log('Checking file ' + f)
          const mdxfile = f.replace(/.[jt]s[x]*$/i, '.mdx')
          if (!fs.existsSync(mdxfile)) {
            debug(`Creating ${mdxfile}`)
            const contents = `
---
name: ${filename}
path: ${parts.join('/')}
---
import Component from './${filename}'

<Component>${filename}</Component>

            `
            fs.writeFileSync(mdxfile, contents, { encoding: 'utf8' })
          }
        }
      }
    })
    console.log('Done checking')
  } catch (e) {
    console.error(e)
  }

  return []
}

const generate = async opts => {
  return await doit(opts)
}

module.exports = { generate }
