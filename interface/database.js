/* @flow */
import type { Database as SQLiteDatabase } from 'sqlite3'

export type Database = {
  sqlite: SQLiteDatabase
}
