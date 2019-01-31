/* @flow */
import type { Client, Rows } from 'rumor-mill/interface'
import { sendQuery } from 'rumor-mill/actions'

export default function<Row>(
  client: Client,
  tableName: string
): Promise<Rows<Row>> {
  return sendQuery<Row>(client, {
    $select: {
      $from: tableName
    }
  })
}
