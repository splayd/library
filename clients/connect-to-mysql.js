/* @flow */
import { makeMySQLClient } from 'rumor-mill/interface'
import { promiseFromCallback, retry } from 'rumor-mill/lib'
import { createPool } from 'mysql'

export default async function(url: string) {
  const pool = createPool(url)
  await retry(10, 3000, () =>
    promiseFromCallback(callback => pool.query('SELECT 1', callback))
  )
  return makeMySQLClient({ pool })
}
