/* @flow */
import test from 'ava'
import { createInMemoryDb, close, sendQuery } from 'rumor-mill'

test('running queries', async t => {
  const db = await createInMemoryDb()

  await sendQuery(
    db,
    `
    CREATE TABLE articles (
      id integer PRIMARY KEY,
      title text NOT NULL
    )
  `
  )
  await sendQuery(db, "INSERT INTO articles (title) VALUES('Post 1')")
  await sendQuery(db, "INSERT INTO articles (title) VALUES('Post 2')")

  const rows = await sendQuery(db, 'SELECT * from articles')
  t.deepEqual(rows, [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }])

  await close(db)
})
