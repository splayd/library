/* @flow */
import type { Database } from 'rumor-mill'
import * as sqlite3 from 'sqlite3'

export default async function(): Promise<Database> {
  const sqlite = new sqlite3.Database(':memory:')
  await new Promise((resolve, reject) => {
    sqlite.once('open', resolve)
    sqlite.once('error', reject)
  })
  return {
    sqlite
  }
}
