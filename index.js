/* @flow */
export type { Database } from './interface/database'

export { default as createInMemoryDb } from './actions/create-in-memory-db'
export { default as close } from './actions/close'

export { default as sendQuery } from './actions/send-query'

export { default as promiseFromCallback } from './lib/promise-from-callback'
