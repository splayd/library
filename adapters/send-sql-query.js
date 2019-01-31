/* @flow */
import type { SQLQuery } from 'rumor-mill/adapters'
import type { Client, Rows } from 'rumor-mill/interface'
import { branch } from 'rumor-mill/interface'
import { promiseFromCallback } from 'rumor-mill/lib'
export default function<Row>(
  client: Client,
  sqlQuery: SQLQuery
): Promise<Rows<Row>> {
  return branch({
    async mysql({ mysql: { pool } }, query) {
      const results = await promiseFromCallback(callback =>
        pool.query(
          {
            ...query,
            typeCast: (field, next) => {
              if (field.type === 'TINY' && field.length === 1) {
                return field.string() === '1'
              }

              return next()
            }
          },
          callback
        )
      )
      return Array.from(results).map(result => ({ ...result }))
    },

    async postgresql({ postgresql: { pool } }, { sql, values }) {
      const result = await pool.query(sql, values)
      return result.rows
    },

    sqlite({ sqlite: { database } }, { sql, values }) {
      return promiseFromCallback(callback =>
        database.all(sql, values, callback)
      )
    }
  })(client, sqlQuery)
}
