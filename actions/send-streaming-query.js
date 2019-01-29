/* @flow */
import type { Client, Row } from 'rumor-mill/interface'
import type { Query } from 'rumor-mill/adapters'
import { buildSQLQuery, sendStreamingSQLQuery } from 'rumor-mill/adapters'

export default function(client: Client, query: Query): AsyncIterator<Row> {
  return sendStreamingSQLQuery(client, buildSQLQuery(client, query))
}
