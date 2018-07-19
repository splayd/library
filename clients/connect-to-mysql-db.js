/* @flow */
import type { Database } from 'rumor-mill/clients'
import { promiseFromCallback, sleep } from 'rumor-mill/lib'
import { createPool } from 'mysql'

export default async function(url: string): Promise<Database> {
  const pool = createPool(url)

  await retry(10, 3000, () =>
    promiseFromCallback(callback => pool.query('SELECT 1', callback))
  )

  return {
    mysql: { pool }
  }
}

async function retry<T>(
  times: number,
  interval: number,
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    await sleep(interval)
    return retry(times - 1, interval, fn)
  }
}
