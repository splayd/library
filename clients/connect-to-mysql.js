/* @flow */
import { makeMySQLClient } from 'rumor-mill/interface'
import { promiseFromCallback, retry } from 'rumor-mill/lib'
import { createPool } from 'mysql'

export default async function(url: string) {
  const pool = createPool(url)

  await retry({
    times: 10,
    wait: 3000,
    effect: () =>
      promiseFromCallback(callback => pool.query('SELECT 1', callback)),
    checkError: error => error.message.includes('Connection lost')
  })

  return makeMySQLClient({ pool })
}
