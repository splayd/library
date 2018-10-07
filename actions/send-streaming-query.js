/* @flow */
import type { Client } from 'rumor-mill/interface'
import type { Query, Row } from 'rumor-mill/adapters'
import { buildSQLQuery, sendStreamingSQLQuery } from 'rumor-mill/adapters'

export default function(
  client: Client,
  query: Query
): AsyncGenerator<Row, void, void> {
  return sendStreamingSQLQuery(client, buildSQLQuery(client, query))
}
