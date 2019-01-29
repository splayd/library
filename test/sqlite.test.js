/* @flow */
import test from 'ava'
import {
  openDatabase,
  closeDatabase,
  createTables,
  insertRows,
  selectRows,
  streamRows
} from 'rumor-mill'

test('interacting with an in-memory SQLite database', async t => {
  const database = await openDatabase('sqlite://')

  await createTables(database, {
    articles: { id: 'primary-key', title: 'string' }
  })

  await insertRows(database, 'articles', [
    { title: 'Post 1' },
    { title: 'Post 2' }
  ])

  const articles = await selectRows(database, 'articles')
  t.deepEqual(articles, [
    { id: 1, title: 'Post 1' },
    { id: 2, title: 'Post 2' }
  ])

  await closeDatabase(database)
})

test('streaming rows', async t => {
  const database = await openDatabase('sqlite://')
  await createTables(database, {
    'time-series': { id: 'primary-key', value: 'integer' }
  })
  await insertRows(database, 'time-series', [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 }
  ])

  const rows = streamRows(database, 'time-series')
  t.deepEqual(await rows.next(), { done: false, value: { id: 1, value: 1 } })
  t.deepEqual(await rows.next(), { done: false, value: { id: 2, value: 2 } })
  t.deepEqual(await rows.next(), { done: false, value: { id: 3, value: 3 } })
  t.deepEqual(await rows.next(), { done: false, value: { id: 4, value: 4 } })
  t.deepEqual(await rows.next(), { done: false, value: { id: 5, value: 5 } })
  t.deepEqual(await rows.next(), { done: true, value: undefined })

  await closeDatabase(database)
})
