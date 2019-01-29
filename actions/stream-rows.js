/* @flow */
import type { Client } from 'rumor-mill/interface'
import type { Row } from 'rumor-mill/adapters'
import { sendStreamingQuery } from 'rumor-mill/actions'

export default function(client: Client, tableName: string): AsyncIterator<Row> {
  return sendStreamingQuery(client, {
    $select: {
      $from: tableName
    }
  })
}
