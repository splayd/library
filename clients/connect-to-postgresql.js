/* @flow */
import type { Database } from 'rumor-mill/clients'
import { retry } from 'rumor-mill/lib'
import { Pool } from 'pg'

export default async function(url: string): Promise<Database> {
  const pool = new Pool({ connectionString: url })

  await retry(10, 3000, () => pool.query('SELECT 1'))

  return {
    postgresql: { pool }
  }
}
