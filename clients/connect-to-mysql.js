/* @flow */
import type { Database } from 'rumor-mill/clients'
import { promiseFromCallback, retry } from 'rumor-mill/lib'
import { createPool } from 'mysql'

export default async function(url: string): Promise<Database> {
  const pool = createPool(url)

  await retry(10, 3000, () =>
    promiseFromCallback(callback => pool.query('SELECT 1', callback))
  )

  return {
    type: 'mysql',
    mysql: { pool }
  }
}
