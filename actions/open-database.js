/* @flow */
import type { Client } from 'rumor-mill/interface'
import { connect } from 'rumor-mill/clients'

export default function(url: string): Promise<Client> {
  return connect(url)
}
