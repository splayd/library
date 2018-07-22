/* @flow */
import type { Database as SQLiteDatabase } from 'sqlite3'
import type { Pool as MySQLConnectionPool } from 'mysql/lib/Pool'
import type { Pool as PostgreSQLConnectionPool } from 'pg'

export type DatabaseWithMySQL = {
  mysql: { pool: MySQLConnectionPool },
  postgresql?: empty,
  sqlite?: empty
}

export type DatabaseWithPostgreSQL = {
  mysql?: empty,
  postgresql: { pool: PostgreSQLConnectionPool },
  sqlite?: empty
}

export type DatabaseWithSQLite = {
  mysql?: empty,
  postgresql?: empty,
  sqlite: { database: SQLiteDatabase }
}

export type Database =
  | DatabaseWithMySQL
  | DatabaseWithPostgreSQL
  | DatabaseWithSQLite
