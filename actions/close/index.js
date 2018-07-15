/* @flow */
import type { Database } from 'rumor-mill'
import { promiseFromCallback } from 'rumor-mill'

export default async function({ sqlite }: Database): Promise<void> {
  await promiseFromCallback(callback => sqlite.close(callback))
  await sqlite.close()
}
