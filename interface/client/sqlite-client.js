/* @flow */
import type sqlite3 from 'sqlite3'

export type SQLiteClient = {|
  type: 'sqlite',
  sqlite: {| database: sqlite3.Database |}
|}

export function makeSQLiteClient(client: {|
  database: sqlite3.Database
|}): SQLiteClient {
  return { type: 'sqlite', sqlite: client }
}
