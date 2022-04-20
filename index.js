const f = {}

import common from './modules/common.js'
Object.assign(f, common)

import textarea from './modules/textarea.js'
Object.assign(f, textarea)

export default { ...f }
