/* @flow */
import type { MySQLClient, PostgreSQLClient, SQLiteClient } from './'

export type Client = MySQLClient | PostgreSQLClient | SQLiteClient
