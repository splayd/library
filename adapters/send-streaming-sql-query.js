/* eslint-disable no-unmodified-loop-condition */
/* @flow */
import type { SQLQuery, Row } from 'rumor-mill/adapters'
import { branch } from 'rumor-mill/interface'
import { promiseFromCallback } from 'rumor-mill/lib'
import PgCursor from 'pg-cursor'
import { fromQueue, fromStream } from 'heliograph'

export default branch({
  async *mysql(
    {
      mysql: { pool }
    },
    query: SQLQuery
  ): AsyncGenerator<Row, void, void> {
    for await (const row of fromStream(pool.query(query).stream())) {
      yield JSON.parse(JSON.stringify(row))
    }
  },

  async *postgresql(
    {
      postgresql: { pool }
    },
    { sql, values }: SQLQuery
  ): AsyncGenerator<Row, void, void> {
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

  async *sqlite(
    {
      sqlite: { database }
    },
    { sql, values }: SQLQuery
  ): AsyncGenerator<Row, void, void> {
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
