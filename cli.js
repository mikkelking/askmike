#!/usr/bin/env node

const chalk = require("chalk");
const fs = require("fs");
const ip = require("ip");
const os = require("os");

const [, , ...args] = process.argv;
const target = args[0];

const getip = () => {
  const ifaces = os.networkInterfaces();
  const results = [];

  Object.keys(ifaces).forEach(function(ifname) {
    let alias = 0;

    ifaces[ifname].forEach(function(iface) {
      if ("IPv4" !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        results.push(`${ifname}(${alias}): ${iface.address}`);
      } else {
        // this interface has only one ipv4 adress
        results.push(`${ifname}: ${iface.address}`);
      }
      ++alias;
    });
  });
  return results;
};

switch (target) {
  case "ip":
    const addr = ip.address();
    console.log(`Your ip address is ${addr}`);
    break;
  case "ipall":
    const addresses = getip();
    console.log(`IP Addresses: \n${addresses.join("\n")}`);
    break;
  case "nab-check":
    console.log(`nab-check is not supported yet`);
    break;
  default:
    console.log(
      "Please provide a command as a parameter, eg 'ip' or 'nab-check'"
    );
    break;
}
