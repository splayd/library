/* @flow */
import test from 'ava'
import {
  openDatabase,
  closeDatabase,
  columnTypes,
  createTables,
  insertRows,
  selectRows,
  streamRows
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

test('streaming rows', async t => {
  const database1 = await openDatabase('sqlite://')
  const database2 = await createTables(database1, {
    'time-series': { id: columnTypes.primaryKey, value: columnTypes.integer }
  })
  await insertRows(database2, 'time-series', [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 }
  ])

  const rows = streamRows(database2, 'time-series')
  t.deepEqual(await rows.next(), { done: false, value: { id: 1, value: 1 } })
  t.deepEqual(await rows.next(), { done: false, value: { id: 2, value: 2 } })
  t.deepEqual(await rows.next(), { done: false, value: { id: 3, value: 3 } })
  t.deepEqual(await rows.next(), { done: false, value: { id: 4, value: 4 } })
  t.deepEqual(await rows.next(), { done: false, value: { id: 5, value: 5 } })
  t.deepEqual(await rows.next(), { done: true, value: undefined })

  await closeDatabase(database2)
})
