/* @flow */
import type { Client } from 'rumor-mill/interface'
import { sendQuery } from 'rumor-mill/actions'

export default function<
  Schema: {},
  TableName: string,
  Database: { client: Client, schema: Schema }
>(
  { client, schema }: Database,
  tableName: TableName
): Promise<Array<$ElementType<Schema, TableName>>> {
  return sendQuery(client, {
    $select: {
      $from: tableName
    }
  })
}
