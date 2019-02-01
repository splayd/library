/* @flow */
import type { Client, ColumnType } from 'rumor-mill/interface'
import { createTable } from 'rumor-mill/actions'

export default async function(
  client: Client,
  newTables: { [string]: { [string]: ColumnType } }
): Promise<void> {
  for (const tableName of Object.keys(newTables)) {
    await createTable(client, tableName, newTables[tableName])
  }
}
