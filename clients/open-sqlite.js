/* @flow */
import type { Database } from 'rumor-mill/clients'
import * as sqlite3 from 'sqlite3'

export default async function(filename: string): Promise<Database> {
  const database = new sqlite3.Database(filename)
  await new Promise((resolve, reject) => {
    database.once('open', resolve)
    database.once('error', reject)
  })
  return {
    type: 'sqlite',
    sqlite: { database }
  }
}
