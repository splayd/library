/* @flow */
import type { Query, ClientQuery } from 'rumor-mill/adapters'
import { branchOnClient } from 'rumor-mill/clients'
import SQLBuilder from 'json-sql-builder2'

export default branchOnClient({
  mysql(database, query: Query): ClientQuery {
    const builder = new SQLBuilder('MySQL')
    return builder.build(query)
  },

  postgresql(database, query: Query): ClientQuery {
    const builder = new SQLBuilder('PostgreSQL')
    return builder.build(query)
  },

  sqlite(database, query: Query): ClientQuery {
    const builder = new SQLBuilder('SQLite')
    return builder.build(query)
  }
})
