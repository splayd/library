/* @flow */
import test from 'ava'
import { startContainer, stopContainer } from 'rumor-mill/test/helpers'
import {
  connectToPostgreSQL,
  close,
  sendQuery,
  createTable,
  insertRow
} from 'rumor-mill'

test('interacting with a PostgreSQL database', async t => {
  const container = await startContainer({
    Image: 'postgres:latest',
    PublishAllPorts: true,
    Env: [
      'POSTGRES_DB=database',
      'POSTGRES_USER=user',
      'POSTGRES_PASSWORD=password'
    ]
  })
  const port = container.metadata.NetworkSettings.Ports['5432/tcp'][0].HostPort

  const db = await connectToPostgreSQL(
    `postgresql://user:password@127.0.0.1:${port}/database`
  )

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
  await stopContainer(container)
})
