/* @flow */
import type { default as MySQLPool } from 'mysql/lib/Pool'

export type MySQLClient = {|
  type: 'mysql',
  mysql: {| pool: MySQLPool |}
|}

export function makeMySQLClient(client: {| pool: MySQLPool |}): MySQLClient {
  return { type: 'mysql', mysql: client }
}
