/* @flow */
import type { Query, SQLQuery } from 'rumor-mill/adapters'
import { branch } from 'rumor-mill/interface'
import SQLBuilder from 'json-sql-builder2'

export default branch({
  mysql(database, query: Query): SQLQuery {
    const builder = new SQLBuilder('MySQL')
    return builder.build(query)
  },

  postgresql(database, query: Query): SQLQuery {
    const builder = new SQLBuilder('PostgreSQL')
    return builder.build(query)
  },

  sqlite(database, query: Query): SQLQuery {
    const builder = new SQLBuilder('SQLite')
    return builder.build(query)
  }
})
