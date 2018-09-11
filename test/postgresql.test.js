/* @flow */
import test from 'ava'
import { startContainer, stopContainer } from 'rumor-mill/test/helpers'
import {
  openDatabase,
  closeDatabase,
  columnTypes,
  createTables,
  insertRows,
  selectRows
} from 'rumor-mill'

let container, port

test.before(async () => {
  container = await startContainer({
    Image: 'postgres:latest',
    PublishAllPorts: true,
    Env: [
      'POSTGRES_DB=database',
      'POSTGRES_USER=user',
      'POSTGRES_PASSWORD=password'
    ]
  })

  port = container.metadata.NetworkSettings.Ports['5432/tcp'][0].HostPort
})

test.after.always(async () => {
  await stopContainer(container)
})

test('interacting with a PostgreSQL database', async t => {
  const database1 = await openDatabase(
    `postgresql://user:password@127.0.0.1:${port}/database`
  )

  const database2 = await createTables(database1, {
    articles: { id: columnTypes.primaryKey, title: columnTypes.string }
  })
  await insertRows(database2, 'articles', [
    { title: 'Post 1' },
    { title: 'Post 2' }
  ])

  const articles = await selectRows(database2, 'articles')
  t.deepEqual(articles, [
    { id: 1, title: 'Post 1' },
    { id: 2, title: 'Post 2' }
  ])

  await closeDatabase(database2)
})

test('attempting to connect with incorrect credentials', async t => {
  await t.throwsAsync(
    openDatabase(`postgresql://user:wrong@127.0.0.1:${port}/database`),
    {
      message: 'password authentication failed for user "user"'
    }
  )
})
