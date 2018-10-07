/* @flow */
import type { Client } from 'rumor-mill/interface'
import { sendStreamingQuery } from 'rumor-mill/actions'

export default function<
  Schema: {},
  TableName: $Keys<Schema>,
  Database: { client: Client, schema: Schema }
>(
  { client, schema }: Database,
  tableName: TableName
): AsyncGenerator<$ElementType<Schema, TableName>, void, void> {
  return sendStreamingQuery(client, {
    $select: {
      $from: tableName
    }
  })
}
