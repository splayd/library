/* @flow */
import test from 'ava'
import { startContainer, removeContainer } from 'sidelifter'
import {
  openDatabase,
  closeDatabase,
  createTables,
  createIndex,
  readSchema,
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
    articles: {
      id: 'primary-key',
      title: 'string',
      time: 'datetime',
      public: 'boolean',
      rating: 'float',
      views: 'integer'
    }
  })

  const schema = await readSchema(database)
  t.deepEqual(schema.articles, {
    id: 'primary-key',
    title: 'string',
    time: 'datetime',
    public: 'boolean',
    rating: 'float',
    views: 'integer'
  })

  await insertRows(database, 'articles', [
    {
      title: 'Post 1',
      time: new Date('2018-01-01'),
      public: true,
      rating: 3.0,
      views: 5
    },
    {
      title: 'Post 2',
      time: new Date('2019-01-01'),
      public: false,
      rating: 0.0,
      views: 0
    }
  ])

  const articles = await selectRows(database, 'articles')
  t.deepEqual(articles, [
    {
      id: 1,
      title: 'Post 1',
      time: new Date('2018-01-01'),
      public: true,
      rating: 3.0,
      views: 5
    },
    {
      id: 2,
      title: 'Post 2',
      time: new Date('2019-01-01'),
      public: false,
      rating: 0.0,
      views: 0
    }
  ])

  await createIndex(database, 'articles', ['time'], true)
  await t.throwsAsync(
    insertRows(database, 'articles', [
      {
        title: 'Post 3',
        time: new Date('2019-01-01'),
        public: true,
        rating: 3.0,
        views: 5
      }
    ]),
    /Duplicate entry/
  )

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
    'time-series': {
      id: 'primary-key',
      time: 'datetime',
      value: 'integer',
      good: 'boolean'
    }
  })
  await insertRows(database, 'time-series', [
    { time: new Date('2018-01-01'), value: 1, good: true },
    { time: new Date('2018-01-02'), value: 2, good: false },
    { time: new Date('2018-01-03'), value: 3, good: true },
    { time: new Date('2018-01-04'), value: 4, good: false },
    { time: new Date('2018-01-05'), value: 5, good: true }
  ])

  const rows = streamRows(database, 'time-series')
  t.deepEqual(await rows.next(), {
    done: false,
    value: { id: 1, time: new Date('2018-01-01'), value: 1, good: true }
  })
  t.deepEqual(await rows.next(), {
    done: false,
    value: { id: 2, time: new Date('2018-01-02'), value: 2, good: false }
  })
  t.deepEqual(await rows.next(), {
    done: false,
    value: { id: 3, time: new Date('2018-01-03'), value: 3, good: true }
  })
  t.deepEqual(await rows.next(), {
    done: false,
    value: { id: 4, time: new Date('2018-01-04'), value: 4, good: false }
  })
  t.deepEqual(await rows.next(), {
    done: false,
    value: { id: 5, time: new Date('2018-01-05'), value: 5, good: true }
  })
  t.deepEqual(await rows.next(), { done: true, value: undefined })

  await closeDatabase(database)
})
