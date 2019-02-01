/* @flow */
import type { Client } from 'rumor-mill/interface'
import { sendQuery } from 'rumor-mill/actions'

export default async function(
  client: Client,
  tableName: string,
  columns: Array<string>,
  unique: boolean
): Promise<void> {
  await sendQuery(client, {
    $createIndex: {
      $table: tableName,
      $name: `${tableName}_${columns.join('-')}`,
      $columns: columns,
      $unique: unique
    }
  })
}
