/* @flow */
import type { Database as SQLiteDatabase } from 'sqlite3'
import type { Pool as MySQLConnectionPool } from 'mysql/lib/Pool'

export type DatabaseWithMySQL = {
  mysql: { pool: MySQLConnectionPool },
  sqlite?: empty
}
export type DatabaseWithSQLite = {
  mysql?: empty,
  sqlite: { database: SQLiteDatabase }
}

export type Database = DatabaseWithMySQL | DatabaseWithSQLite
