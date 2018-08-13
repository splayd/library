/* @flow */
import type pg from 'pg'

export type PostgreSQLClient = {|
  type: 'postgresql',
  postgresql: {| pool: pg.Pool |}
|}

export function makePostgreSQLClient(client: {|
  pool: pg.Pool
|}): PostgreSQLClient {
  return { type: 'postgresql', postgresql: client }
}
