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

test('interacting with a MySQL database', async t => {
  const container = await startContainer({
    Image: 'mysql:5',
    PublishAllPorts: true,
    Env: [
      'MYSQL_RANDOM_ROOT_PASSWORD=1',
      'MYSQL_DATABASE=database',
      'MYSQL_USER=user',
      'MYSQL_PASSWORD=password'
    ]
  })
  const port = container.metadata.NetworkSettings.Ports['3306/tcp'][0].HostPort

  const database1 = await openDatabase(
    `mysql://user:password@127.0.0.1:${port}/database`
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
  await stopContainer(container)
})
