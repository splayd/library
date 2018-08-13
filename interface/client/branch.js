/* eslint-disable flowtype/no-weak-types */
/* @flow */
import type { Client, MySQLClient, PostgreSQLClient, SQLiteClient } from './'

export default function<Inputs: any, Output>(branches: {
  mysql: (MySQLClient, ...Inputs) => Output,
  postgresql: (PostgreSQLClient, ...Inputs) => Output,
  sqlite: (SQLiteClient, ...Inputs) => Output
}): (Client, ...Inputs) => Output {
  return (client, ...inputs) => {
    switch (client.type) {
      case 'mysql':
        return branches.mysql(client, ...inputs)
      case 'postgresql':
        return branches.postgresql(client, ...inputs)
      case 'sqlite':
        return branches.sqlite(client, ...inputs)
      default:
        throw new Error('Unexpected Database Client Type')
    }
  }
}
