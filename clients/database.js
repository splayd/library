/* @flow */
import type sqlite3 from 'sqlite3'
import type { default as MySQLPool } from 'mysql/lib/Pool'
import type pg from 'pg'

export type MySQLDatabase = {|
  mysql: { pool: MySQLPool }
|}

export type PostgreSQLDatabase = {|
  postgresql: { pool: pg.Pool }
|}

export type SQLiteDatabase = {|
  sqlite: { database: sqlite3.Database }
|}

export type Database = MySQLDatabase | PostgreSQLDatabase | SQLiteDatabase
