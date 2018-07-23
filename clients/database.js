/* @flow */
import type sqlite3 from 'sqlite3'
import type { default as MySQLPool } from 'mysql/lib/Pool'
import type pg from 'pg'

export type MySQLDatabase = {|
  type: 'mysql',
  mysql: { pool: MySQLPool }
|}

export type PostgreSQLDatabase = {|
  type: 'postgresql',
  postgresql: { pool: pg.Pool }
|}

export type SQLiteDatabase = {|
  type: 'sqlite',
  sqlite: { database: sqlite3.Database }
|}

export type Database = MySQLDatabase | PostgreSQLDatabase | SQLiteDatabase
