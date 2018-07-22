/* @flow */
import type { Database } from 'rumor-mill/clients'
import type { Query, Rows } from 'rumor-mill/adapters'
import { buildQuery, sendQuery } from 'rumor-mill/adapters'

export default function(database: Database, query: Query): Promise<Rows> {
  return sendQuery(database, buildQuery(database, query))
}
