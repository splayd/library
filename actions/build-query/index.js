/* @flow */
import SQLBuilder from 'json-sql-builder2'

type Dialect =
  | 'MySQL'
  | 'MariaDB'
  | 'PostgreSQL'
  | 'SQLite'
  | 'Oracle'
  | 'SQLServer'

type Query = {}

export default function(dialect: Dialect, query: Query): string {
  const builder = new SQLBuilder(dialect)
  return builder.build(query)
}
