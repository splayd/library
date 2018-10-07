/* eslint-disable no-unmodified-loop-condition */
/* @flow */
import type { SQLQuery, Row } from 'rumor-mill/adapters'
import { branch } from 'rumor-mill/interface'
import { promiseFromCallback } from 'rumor-mill/lib'
import PgCursor from 'pg-cursor'

export default branch({
  async *mysql(
    {
      mysql: { pool }
    },
    query: SQLQuery
  ): AsyncGenerator<Row, void, void> {
    const stream = pool.query(query).stream()
    stream.pause()

    let ended = false
    stream.on('end', () => (ended = true))

    while (!ended) {
      const data = stream.read()
      if (data) {
        yield JSON.parse(JSON.stringify(data))
      } else {
        await promiseFromCallback(callback => {
          stream.once('readable', callback)
          stream.once('end', callback)
        })
      }
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
    const queue = []
    let error
    let done = false
    let interrupt = null

    database.each(
      sql,
      values,
      (err, row) => {
        if (err) {
          error = err
        } else {
          queue.push(row)
        }

        if (interrupt) {
          interrupt()
        }
      },
      err => {
        if (err) {
          error = err
        } else {
          done = true
        }

        if (interrupt) {
          interrupt()
        }
      }
    )

    while (true) {
      if (error) {
        throw error
      } else if (queue.length > 0) {
        yield queue.shift()
      } else if (done) {
        return
      } else {
        await new Promise(resolve => {
          interrupt = resolve
        })
        interrupt = null
      }
    }
  }
})
