module.exports = {
  env: {
    http_proxy: 'http://proxy.company.com.au:10091',
    https_proxy: 'http://proxy.company.com.au:10091',
    no_proxy: '.thecompany.com,.company.com.au'
  },
  rc: {
    'strict-ssl': false,
    optional: false,
    '@company:registry': 'https://artifactory.company.com:443/api/npm/NPM-SHARED-build/'
  }
}
