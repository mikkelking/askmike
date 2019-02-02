const os = require('os')

const getip = () => {
  const ifaces = os.networkInterfaces()
  const results = []

  Object.keys(ifaces).forEach(function(ifname) {
    let alias = 0

    ifaces[ifname].forEach(function(iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        results.push(`${ifname}(${alias}): ${iface.address}`)
      } else {
        // this interface has only one ipv4 adress
        results.push(`${ifname}: ${iface.address}`)
      }
      ++alias
    })
  })
  return results
}

module.exports = getip
