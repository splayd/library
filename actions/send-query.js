/* @flow */
import type { Client, Rows } from 'rumor-mill/interface'
import type { Query } from 'rumor-mill/adapters'
import { buildSQLQuery, sendSQLQuery } from 'rumor-mill/adapters'

export default function(client: Client, query: Query): Promise<Rows> {
  return sendSQLQuery(client, buildSQLQuery(client, query))
}
