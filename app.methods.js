const path = require('path')
const colors = require('colors')
const fs = require('fs-extra')

module.exports = {
  getConfig: () => {
    const pwd = process.cwd()
    const configFileName = '.fontprunerc.js'
    const configFilePath = path.join(pwd, configFileName)
    if (!fs.existsSync(configFilePath)) {
      console.log(colors.red('Error: config file is not exist'))
      return false
    }
    return require(configFilePath)
  }
}