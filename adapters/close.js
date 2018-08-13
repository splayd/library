/* @flow */
import { branch } from 'rumor-mill/interface'
import { promiseFromCallback } from 'rumor-mill/lib'

export default branch({
  async mysql({ mysql: { pool } }) {
    await promiseFromCallback(callback => pool.end(callback))
  },

  async postgresql({ postgresql: { pool } }) {
    await pool.end()
  },

  async sqlite({ sqlite: { database } }) {
    await promiseFromCallback(callback => database.close(callback))
  }
})
