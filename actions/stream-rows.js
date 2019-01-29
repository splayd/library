/* @flow */
import type { Client, Row } from 'rumor-mill/interface'
import { sendStreamingQuery } from 'rumor-mill/actions'

export default function(client: Client, tableName: string): AsyncIterator<Row> {
  return sendStreamingQuery(client, {
    $select: {
      $from: tableName
    }
  })
}
