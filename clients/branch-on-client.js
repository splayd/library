/* eslint-disable flowtype/no-weak-types */
/* @flow */
import type {
  DatabaseWithMySQL,
  DatabaseWithSQLite,
  Database
} from 'rumor-mill/clients'

export default function<Inputs: any, Output>(branches: {
  mysql?: (DatabaseWithMySQL, ...Inputs) => Output,
  sqlite?: (DatabaseWithSQLite, ...Inputs) => Output
}): (Database, ...Inputs) => Output {
  return (database, ...inputs) => {
    if (database.mysql && branches.mysql) {
      return branches.mysql(database, ...inputs)
    } else if (database.sqlite && branches.sqlite) {
      return branches.sqlite(database, ...inputs)
    } else {
      throw new Error('Unexpected Database Client')
    }
  }
}
