/* @flow */
import { makePostgreSQLClient } from 'rumor-mill/interface'
import { retry } from 'rumor-mill/lib'
import { Pool } from 'pg'

export default async function(url: string) {
  const pool = new Pool({ connectionString: url })

  await retry({
    times: 10,
    wait: 3000,
    effect: () => pool.query('SELECT 1'),
    checkError: error =>
      error.message.includes('Connection terminated unexpectedly')
  })

  return makePostgreSQLClient({ pool })
}
