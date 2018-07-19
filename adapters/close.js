/* @flow */
import { branchOnClient } from 'rumor-mill/clients'
import { promiseFromCallback } from 'rumor-mill/lib'

export default branchOnClient({
  async mysql({ mysql: { pool } }) {
    await promiseFromCallback(callback => pool.end(callback))
  },

  async sqlite({ sqlite: { database } }) {
    await promiseFromCallback(callback => database.close(callback))
  }
})
