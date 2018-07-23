/* eslint-disable flowtype/no-weak-types */
/* @flow */
import type {
  Database,
  MySQLDatabase,
  PostgreSQLDatabase,
  SQLiteDatabase
} from 'rumor-mill/clients'

export default function<Inputs: any, Output>(branches: {
  mysql: (MySQLDatabase, ...Inputs) => Output,
  postgresql: (PostgreSQLDatabase, ...Inputs) => Output,
  sqlite: (SQLiteDatabase, ...Inputs) => Output
}): (Database, ...Inputs) => Output {
  return (database, ...inputs) => {
    switch (database.type) {
      case 'mysql': return branches.mysql(database, ...inputs)
      case 'postgresql': return branches.postgresql(database, ...inputs)
      case 'sqlite': return branches.sqlite(database, ...inputs)
      default: throw new Error('Unexpected Database Client Type')
    }
  }
}
