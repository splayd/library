/* @flow */
import test from 'ava'
import { startContainer, removeContainer } from 'sidelifter'
import {
  openDatabase,
  closeDatabase,
  columnTypes,
  createTables,
  insertRows,
  selectRows,
  streamRows
} from 'rumor-mill'

let container, port

test.before(async () => {
  container = await startContainer({
    image: 'mysql:5',
    env: {
      MYSQL_RANDOM_ROOT_PASSWORD: '1',
      MYSQL_DATABASE: 'database',
      MYSQL_USER: 'user',
      MYSQL_PASSWORD: 'password'
    }
  })

  port = container.ports.get(3306)
})

test.after.always(async () => {
  await removeContainer(container)
})

test('interacting with a MySQL database', async t => {
  const database = await openDatabase(
    `mysql://user:password@127.0.0.1:${String(port)}/database`
  )

  await createTables(database, {
    articles: { id: columnTypes.primaryKey, title: columnTypes.string }
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

test('attempting to connect with incorrect credentials', async t => {
  await t.throwsAsync(
    openDatabase(`mysql://user:wrong@127.0.0.1:${String(port)}/database`),
    {
      message: /ER_ACCESS_DENIED_ERROR/
    }
  )
})

test('streaming rows', async t => {
  const database = await openDatabase(
    `mysql://user:password@127.0.0.1:${String(port)}/database`
  )

  await createTables(database, {
    'time-series': { id: columnTypes.primaryKey, value: columnTypes.integer }
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
