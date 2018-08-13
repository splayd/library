/* @flow */
import { makeSQLiteClient } from 'rumor-mill/interface'
import * as sqlite3 from 'sqlite3'

export default async function(filename: string) {
  const database = new sqlite3.Database(filename)
  await new Promise((resolve, reject) => {
    database.once('open', resolve)
    database.once('error', reject)
  })
  return makeSQLiteClient({ database })
}
