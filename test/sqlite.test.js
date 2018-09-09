/* @flow */
import test from 'ava'
import {
  openDatabase,
  closeDatabase,
  columnTypes,
  createTables,
  insertRows,
  selectRows
} from 'rumor-mill'

test('interacting with an in-memory SQLite database', async t => {
  const database1 = await openDatabase('sqlite://')

  const database2 = await createTables(database1, {
    articles: { id: columnTypes.primaryKey, title: columnTypes.string }
  })
  const database3 = await createTables(database2, {
    comments: { id: columnTypes.primaryKey, title: columnTypes.string }
  })

  await insertRows(database3, 'articles', [
    { title: 'Post 1' },
    { title: 'Post 2' }
  ])

  const articles = await selectRows(database3, 'articles')
  t.deepEqual(articles, [
    { id: 1, title: 'Post 1' },
    { id: 2, title: 'Post 2' }
  ])

  await closeDatabase(database3)
})
