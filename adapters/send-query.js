/* @flow */
import type { ClientQuery, Rows } from 'rumor-mill/adapters'
import { branchOnClient } from 'rumor-mill/clients'
import { promiseFromCallback } from 'rumor-mill/lib'

export default branchOnClient({
  async mysql(
    {
      mysql: { pool }
    },
    query: ClientQuery
  ): Promise<Rows> {
    const results = await promiseFromCallback(callback =>
      pool.query(query, callback)
    )
    return JSON.parse(JSON.stringify(results))
  },

  async postgresql(
    {
      postgresql: { pool }
    },
    { sql, values }: ClientQuery
  ): Promise<Rows> {
    const result = await pool.query(sql, values)
    return result.rows
  },

  sqlite(
    {
      sqlite: { database }
    },
    { sql, values }: ClientQuery
  ): Promise<Rows> {
    return promiseFromCallback(callback => database.all(sql, values, callback))
  }
})
