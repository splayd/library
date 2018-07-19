/* @flow */
import test from 'ava'
import { createInMemoryDb } from 'rumor-mill/clients'
import { close, sendQuery, buildQuery } from 'rumor-mill/adapters'

test('interacting with an in-memory SQLite database', async t => {
  const db = await createInMemoryDb()

  await sendQuery(db, {
    sql: `
        CREATE TABLE articles (
          id integer PRIMARY KEY,
          title text NOT NULL
        )
      `,
    values: []
  })

  await sendQuery(db, {
    sql: 'INSERT INTO articles (title) VALUES(?)',
    values: ['Post 1']
  })

  await sendQuery(db, {
    sql: 'INSERT INTO articles (title) VALUES(?)',
    values: ['Post 2']
  })

  const rows = await sendQuery(
    db,
    buildQuery(db, {
      $select: {
        $from: 'articles'
      }
    })
  )
  t.deepEqual(rows, [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }])

  await close(db)
})
