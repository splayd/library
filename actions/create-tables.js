/* @flow */
import type { Client, ColumnType } from 'rumor-mill/interface'
import { getColumnTypeName } from 'rumor-mill/interface'
import { sendQuery } from 'rumor-mill/actions'
import { mapValues } from 'lodash'

export default async function(
  client: Client,
  newTables: { [string]: { [string]: ColumnType } }
): Promise<void> {
  for (const tableName of Object.keys(newTables)) {
    await sendQuery(client, {
      $createTable: {
        $table: tableName,
        $define: mapValues(newTables[tableName], type => ({
          $column: {
            $type: getColumnTypeName(type, client.type),
            $notNull: true
          }
        }))
      }
    })
  }
}
