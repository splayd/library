/* @flow */
import { branchOnClient } from 'rumor-mill/clients'
import { promiseFromCallback } from 'rumor-mill/lib'

type Query = {
  sql: string,
  values: Array<string | number | boolean | null>
}

export default branchOnClient({
  async mysql(
    {
      mysql: { pool }
    },
    query: Query
  ): Promise<Array<{}>> {
    const results = await promiseFromCallback(callback =>
      pool.query(query, callback)
    )
    return JSON.parse(JSON.stringify(results))
  },

  async sqlite(
    {
      sqlite: { database }
    },
    { sql, values }: Query
  ): Promise<Array<{}>> {
    return promiseFromCallback(callback => database.all(sql, values, callback))
  }
})
