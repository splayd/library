/* @flow */
import type { Client } from 'rumor-mill/interface'
import { getColumnTypeName } from 'rumor-mill/interface'
import { sendQuery } from 'rumor-mill/actions'
import { mapValues } from 'lodash'

export default async function<
  CurrentSchema: {},
  NewTables: {},
  Database: {
    client: Client,
    schema: CurrentSchema
  }
>(
  { client, schema }: Database,
  newTables: NewTables
): Promise<{
  client: Client,
  schema: {
    ...$Exact<CurrentSchema>,
    ...$Exact<NewTables>
  }
}> {
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

  return {
    client,
    schema: { ...schema, newTables }
  }
}
