/* @flow */
import type { Client, Rows } from 'rumor-mill/interface'
import { sendQuery } from 'rumor-mill/actions'

export default function(client: Client, tableName: string): Promise<Rows> {
  return sendQuery(client, {
    $select: {
      $from: tableName
    }
  })
}
