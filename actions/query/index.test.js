/* @flow */
import test from 'ava'
import { createInMemoryDb, close, query } from 'rumor-mill'

test('running queries', async t => {
  const db = await createInMemoryDb()

  await query(
    db,
    `
    CREATE TABLE articles (
      id integer PRIMARY KEY,
      title text NOT NULL
    )
  `
  )
  await query(db, "INSERT INTO articles (title) VALUES('Post 1')")
  await query(db, "INSERT INTO articles (title) VALUES('Post 2')")

  const rows = await query(db, 'SELECT * from articles')
  t.deepEqual(rows, [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }])

  await close(db)
})
