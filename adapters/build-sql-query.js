/* @flow */
import type { Query, SQLQuery } from 'rumor-mill/adapters' // eslint-disable-line
import { branch } from 'rumor-mill/interface'
import SQLBuilder from 'json-sql-builder2'

export default branch /*:: <[Query], SQLQuery> */ ({ // eslint-disable-line
  mysql(database, query) {
    const builder = new SQLBuilder('MySQL')
    return builder.build(query)
  },

  postgresql(database, query) {
    const builder = new SQLBuilder('PostgreSQL')
    return builder.build(query)
  },

  sqlite(database, query) {
    const builder = new SQLBuilder('SQLite')
    return builder.build(query)
  }
})
