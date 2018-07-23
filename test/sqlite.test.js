/* @flow */
import test from 'ava'
import {
  openSQLite,
  close,
  createTable,
  insertRow,
  sendQuery
} from 'rumor-mill'

test('interacting with an in-memory SQLite database', async t => {
  const db = await openSQLite(':memory:')

  await createTable(db, 'articles', [
    { name: 'id', type: 'primaryKey' },
    { name: 'title', type: 'string' }
  ])
  await insertRow(db, 'articles', { title: 'Post 1' })
  await insertRow(db, 'articles', { title: 'Post 2' })

  const rows = await sendQuery(db, {
    $select: {
      $from: 'articles'
    }
  })
  t.deepEqual(rows, [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }])

  await close(db)
})
