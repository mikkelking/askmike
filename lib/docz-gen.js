const chalk = require('chalk')
const fs = require('fs')
const recursive = require('recursive-readdir')
const debug = require('debug')('askmike:docz')

const settings = require('./settings')

const uc1 = str => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
const toPascalCase = str => {
  return str
    .split(/\W/)
    .map(uc1)
    .join('')
}

const elements = {
  Button: { props: { size: 'large' }, content: `This is a button` },
  Heading: { content: 'H1 text' },
  InputField: { props: { placeholder: 'Enter something meaningful here' } },
  Input: { props: { placeholder: 'Enter something meaningful here' } },
  List: {
    content: '<ListItem label="Johannesburg"/><ListItem label="San Francisco"/><ListItem label="New York"/>',
    imports: "import ListItem from '../list-item'"
  },
  ListItem: {
    content: 'A major city near you'
  },
  Text: {
    content: 'Ipsum Lorem etc goes here'
  },
  ListItemTransaction: {
    content: 'Savings account',
    props: {
      date: '2 days ago',
      value: '$200',
      description: 'Transfer to checking account'
    }
  },
  ListItemIcon: {
    content: 'You received a message from NAB',
    props: {
      category: 'messages',
      description: 'Transfer to checking account'
    }
  },
  Markdown: {
    props: {
      source: `
    # Sample markdown document

    Some kind of description of the thing

    * Item 1
    * Item 2
    
    | Item | Description |
    | One | First one |
    | Two | Second one |

`
    }
  }
}

const doit = async opts => {
  const tdir = opts._[1]
  debug('Generating .mdx files for Docz from directory:', tdir)
  try {
    const files = await recursive(tdir, ['index.js', 'theme.js', '*.styles.js'])
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
          if (!fs.existsSync(mdxfile) || opts.replace) {
            debug(`Creating ${mdxfile}`)
            const component = toPascalCase(filename.replace(/\.\w+$/, ''))
            const props = elements[component] && elements[component].props ? elements[component].props : {}
            const eProps = Object.keys(props)
              .map(prop => `${prop}="${props[prop]}"`)
              .join(' ')
            const example =
              elements[component] && elements[component].content
                ? `<${component} ${eProps}>${elements[component].content}</${component}>`
                : `<${component} ${eProps}/>`
            const imports = elements[component] && elements[component].imports ? elements[component].imports : ''
            const contents = `
---
name: ${component}
path: ${parts.join('/')}
---
import { Playground, PropsTable } from 'docz'
import {ThemeProvider} from 'styled-components'

import theme from '../theme'
import ${component} from './${filename}'
${imports}

# ${component}

<PropsTable of={${component}} />

## Basic usage

<Playground>
  <ThemeProvider theme={theme}>
    ${example}
  </ThemeProvider>
</Playground>


## Example

<ThemeProvider theme={theme}>
  ${example}
</ThemeProvider>

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
