/* @flow */
import test from 'ava'
import { createInMemoryDb, close, sendQuery } from 'rumor-mill'

test('running queries', async t => {
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

  const rows = await sendQuery(db, {
    sql: 'SELECT * from articles',
    values: []
  })
  t.deepEqual(rows, [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }])

  await close(db)
})
