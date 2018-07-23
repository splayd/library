/* @flow */
import type { Database } from 'rumor-mill/clients'
import { sendQuery } from 'rumor-mill/actions'

export default async function(
  database: Database,
  tableName: string,
  row: { [string]: string }
): Promise<void> {
  await sendQuery(database, {
    $insert: {
      $table: tableName,
      $columns: Object.keys(row),
      $values: Object.values(row)
    }
  })
}
