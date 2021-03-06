/* @flow */
/* eslint-disable no-unmodified-loop-condition */
import type { SQLQuery } from 'rumor-mill/adapters' // eslint-disable-line
import type { Row } from 'rumor-mill/interface' // eslint-disable-line
import { branch } from 'rumor-mill/interface'
import { promiseFromCallback } from 'rumor-mill/lib'
import PgCursor from 'pg-cursor'
import { fromQueue, fromStream } from 'heliograph'

export default branch /*:: <[SQLQuery], AsyncIterator<Row>> */ ({ // eslint-disable-line
  async *mysql({ mysql: { pool } }, query) {
    const stream = pool
      .query({
        ...query,
        typeCast: (field, next) => {
          if (field.type === 'TINY' && field.length === 1) {
            return field.string() === '1'
          }

          return next()
        }
      })
      .stream()
    for await (const row of fromStream(stream)) {
      yield { ...row }
    }
  },

  async *postgresql({ postgresql: { pool } }, { sql, values }) {
    const client = await pool.connect()
    const cursor = client.query(new PgCursor(sql, values))

    while (true) {
      const rows = await promiseFromCallback(callback =>
        cursor.read(1000, callback)
      )

      if (rows.length === 0) break
      yield* rows
    }

    cursor.close(() => {
      client.release()
    })
  },

  async *sqlite({ sqlite: { database } }, { sql, values }) {
    const queue = fromQueue()
    database.each(
      sql,
      values,
      (error, row) => {
        if (error) {
          queue.pushError(error)
        } else {
          queue.push(row)
        }
      },
      error => {
        if (error) {
          queue.pushError(error)
        } else {
          queue.end()
        }
      }
    )
    yield* queue
  }
})
