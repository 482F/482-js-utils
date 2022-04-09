const f = {}

const common = require('./modules/common.js')
Object.assign(f, common)


module.exports = {
  ...f,
}
