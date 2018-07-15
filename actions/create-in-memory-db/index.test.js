/* @flow */
import test from 'ava'
import { promisify } from 'util'
import { createInMemoryDb } from 'rumor-mill'

test('creating an in-memory SQLite database', async t => {
  const db = await createInMemoryDb()
  const run = promisify(db.sqlite.run.bind(db.sqlite))
  const all = promisify(db.sqlite.all.bind(db.sqlite))
  const close = promisify(db.sqlite.close.bind(db.sqlite))

  await run(`
    CREATE TABLE articles (
      id integer PRIMARY KEY,
      title text NOT NULL
    )
  `)
  await run('INSERT INTO articles (title) VALUES(?)', ['Post 1'])
  await run('INSERT INTO articles (title) VALUES(?)', ['Post 2'])

  const rows = await all('SELECT * from articles')
  t.deepEqual(rows, [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }])

  await close()
})
