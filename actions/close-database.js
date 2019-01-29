/* @flow */
import type { Client } from 'rumor-mill/interface'
import { close } from 'rumor-mill/adapters'

export default async function(client: Client): Promise<void> {
  await close(client)
}
