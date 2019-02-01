/* @flow */
import type { Client, Rows } from 'rumor-mill/interface'
import { branch } from 'rumor-mill/interface'
import { sendQuery } from 'rumor-mill/actions'

const getVariableLimit = branch<[], number>({
  mysql: () => Infinity,
  postgresql: () => 34464,
  sqlite: () => 999
})

export default async function<Row: {}>(
  client: Client,
  tableName: string,
  rows: Rows<Row>
): Promise<void> {
  if (rows.length === 0) {
    throw new Error('Must insert at least 1 row.')
  }

  const variableLimit = getVariableLimit(client)
  const variablesPerRow = Object.keys(rows[0]).length
  const batchSize = Math.floor(variableLimit / variablesPerRow)

  let cursor = 0
  while (cursor < rows.length) {
    await sendQuery<Row>(client, {
      $insert: {
        $table: tableName,
        $documents: rows.slice(cursor, cursor + batchSize)
      }
    })
    cursor += batchSize
  }
}
