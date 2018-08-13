/* @flow */
import type { Client } from 'rumor-mill/interface'
import { parse } from 'url'
import {
  connectToMySQL,
  connectToPostgreSQL,
  openSQLite
} from 'rumor-mill/clients'

export default function(url: string): Promise<Client> {
  const { protocol, path } = parse(url)

  switch (protocol) {
    case 'mysql:':
      return connectToMySQL(url)
    case 'postgresql:':
      return connectToPostgreSQL(url)
    case 'sqlite:':
      return openSQLite(path || ':memory:')
    default:
      throw new Error('Unexpected Database Type')
  }
}
