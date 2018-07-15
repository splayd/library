/* @flow */
import type { Database } from 'rumor-mill'
import { promiseFromCallback } from 'rumor-mill'

export default function(
  { sqlite }: Database,
  sqlQuery: string
): Promise<Array<{}>> {
  return promiseFromCallback(callback => sqlite.all(sqlQuery, callback))
}
