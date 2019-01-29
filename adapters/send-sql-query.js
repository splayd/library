/* @flow */
import type { SQLQuery } from 'rumor-mill/adapters'
import type { Rows } from 'rumor-mill/interface'
import { branch } from 'rumor-mill/interface'
import { promiseFromCallback } from 'rumor-mill/lib'

export default branch<[SQLQuery], Promise<Rows>>({
  async mysql({ mysql: { pool } }, query) {
    const results = await promiseFromCallback(callback =>
      pool.query(query, callback)
    )
    return JSON.parse(JSON.stringify(results))
  },

  async postgresql({ postgresql: { pool } }, { sql, values }) {
    const result = await pool.query(sql, values)
    return result.rows
  },

  sqlite({ sqlite: { database } }, { sql, values }) {
    return promiseFromCallback(callback => database.all(sql, values, callback))
  }
})
