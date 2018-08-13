/* @flow */
import { makePostgreSQLClient } from 'rumor-mill/interface'
import { retry } from 'rumor-mill/lib'
import { Pool } from 'pg'

export default async function(url: string) {
  const pool = new Pool({ connectionString: url })
  await retry(10, 3000, () => pool.query('SELECT 1'))
  return makePostgreSQLClient({ pool })
}
