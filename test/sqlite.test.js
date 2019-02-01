/* @flow */
import test from 'ava'
import {
  openDatabase,
  closeDatabase,
  readSchema,
  createTables,
  insertRows,
  selectRows,
  streamRows
} from 'rumor-mill'

test('interacting with an in-memory SQLite database', async t => {
  const database = await openDatabase('sqlite://')

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
      time: Date.parse('2018-01-01'),
      public: 1,
      rating: 3.0,
      views: 5
    },
    {
      id: 2,
      title: 'Post 2',
      time: Date.parse('2019-01-01'),
      public: 0,
      rating: 0.0,
      views: 0
    }
  ])

  await closeDatabase(database)
})

test('streaming rows', async t => {
  const database = await openDatabase('sqlite://')

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
    value: { id: 1, time: Date.parse('2018-01-01'), value: 1, good: 1 }
  })
  t.deepEqual(await rows.next(), {
    done: false,
    value: { id: 2, time: Date.parse('2018-01-02'), value: 2, good: 0 }
  })
  t.deepEqual(await rows.next(), {
    done: false,
    value: { id: 3, time: Date.parse('2018-01-03'), value: 3, good: 1 }
  })
  t.deepEqual(await rows.next(), {
    done: false,
    value: { id: 4, time: Date.parse('2018-01-04'), value: 4, good: 0 }
  })
  t.deepEqual(await rows.next(), {
    done: false,
    value: { id: 5, time: Date.parse('2018-01-05'), value: 5, good: 1 }
  })
  t.deepEqual(await rows.next(), { done: true, value: undefined })

  await closeDatabase(database)
})
