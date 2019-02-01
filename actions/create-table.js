/* @flow */
import type { Client, ColumnType } from 'rumor-mill/interface'
import { getColumnTypeName } from 'rumor-mill/interface'
import { sendQuery } from 'rumor-mill/actions'
import { mapValues } from 'lodash'

export default async function(
  client: Client,
  tableName: string,
  columns: { [string]: ColumnType }
): Promise<void> {
  await sendQuery(client, {
    $createTable: {
      $table: tableName,
      $define: mapValues(columns, type => ({
        $column: {
          $type: getColumnTypeName(type, client.type),
          $notNull: true
        }
      }))
    }
  })
}
