import sqlite3 from 'sqlite3'
import { toAsyncCallback } from './common.js'

export function createDbProxy(dbFilePath) {
  return new Proxy(new sqlite3.Database(dbFilePath), {
    get: function (db, key, receiver) {
      if (['run', 'get', 'all'].includes(key)) {
        return async (sql, ...params) =>
          await toAsyncCallback((c) => db[key](sql, ...params, c))
      } else {
        return (...args) => db[key](...args)
      }
    },
  })
}

export function repeatPlaceholder(placeholder, length, joint = ',') {
  return Array(length)
    .fill(0)
    .map(() => placeholder)
    .join(joint)
}
