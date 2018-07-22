/* @flow */
import { sleep } from 'rumor-mill/lib'

export default async function retry<T>(
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
