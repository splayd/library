/* @flow */
import type { Client } from 'rumor-mill/interface'
import type { Rows } from 'rumor-mill/adapters'
import { sendQuery } from 'rumor-mill/actions'

export default async function(
  client: Client,
  tableName: string,
  rows: Rows
): Promise<void> {
  if (rows.length === 0) {
    throw new Error('Must insert at least 1 row.')
  }

  await sendQuery(client, {
    $insert: {
      $table: tableName,
      $columns: Object.keys(rows[0]),
      $records: rows.map(row => ({ $values: Object.values(row) }))
    }
  })
}
