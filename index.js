const f = {}

const common = require('./modules/common.js')
Object.assign(f, common)

const textarea = require('./modules/textarea.js')
Object.assign(f, textarea)

module.exports = {
  ...f,
}
