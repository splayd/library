/* @flow */
export type { Database } from './interface/database'

export { default as createInMemoryDb } from './actions/create-in-memory-db'
export { default as close } from './actions/close'

export { default as query } from './actions/query'

export { default as promiseFromCallback } from './lib/promise-from-callback'
