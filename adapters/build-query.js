/* @flow */
import { branchOnClient } from 'rumor-mill/clients'
import SQLBuilder from 'json-sql-builder2'

type Query = {}
type ParsedQuery = {
  sql: string,
  values: Array<string | number | boolean | null>
}

export default branchOnClient({
  mysql(database, query: Query): ParsedQuery {
    const builder = new SQLBuilder('MySQL')
    return builder.build(query)
  },

  sqlite(database, query: Query): ParsedQuery {
    const builder = new SQLBuilder('SQLite')
    return builder.build(query)
  }
})
