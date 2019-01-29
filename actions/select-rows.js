/* @flow */
import type { Client } from 'rumor-mill/interface'
import type { Rows } from 'rumor-mill/adapters'
import { sendQuery } from 'rumor-mill/actions'

export default function(client: Client, tableName: string): Promise<Rows> {
  return sendQuery(client, {
    $select: {
      $from: tableName
    }
  })
}
