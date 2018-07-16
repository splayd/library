/* @flow */
import type { Database } from 'rumor-mill'
import { promiseFromCallback } from 'rumor-mill'

type Query = {
  sql: string,
  values: Array<string | number | boolean | null>
}

export default function(
  { sqlite }: Database,
  { sql, values }: Query
): Promise<Array<{}>> {
  return promiseFromCallback(callback => sqlite.all(sql, values, callback))
}
