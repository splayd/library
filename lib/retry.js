/* @flow */
import { sleep } from 'rumor-mill/lib'

export default async function retry<T>({
  times,
  wait,
  effect,
  checkError
}: {
  times: number,
  wait: number,
  effect: () => Promise<T>,
  checkError: Error => boolean
}): Promise<T> {
  try {
    return await effect()
  } catch (error) {
    if (!checkError(error)) {
      throw error
    }

    await sleep(wait)
    return retry({ times: times - 1, wait, effect, checkError })
  }
}
