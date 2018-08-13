/* @flow */
import type { Database } from 'rumor-mill/interface'
import { connect } from 'rumor-mill/clients'

export default async function(url: string): Promise<Database> {
  return {
    client: await connect(url),
    schema: {}
  }
}
