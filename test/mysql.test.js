/* @flow */
import test from 'ava'
import { startContainer, stopContainer } from 'rumor-mill/test/helpers'
import { connectToMySQL, close, sendQuery, createTable } from 'rumor-mill'

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

  const db = await connectToMySQL(
    `mysql://user:password@127.0.0.1:${port}/database`
  )

  await createTable(db, 'articles', [
    { name: 'id', type: 'primaryKey' },
    { name: 'title', type: 'string' }
  ])

  await sendQuery(db, {
    $insert: {
      $table: 'articles',
      $columns: ['title'],
      $values: ['Post 1']
    }
  })

  await sendQuery(db, {
    $insert: {
      $table: 'articles',
      $columns: ['title'],
      $values: ['Post 2']
    }
  })

  const rows = await sendQuery(db, {
    $select: {
      $from: 'articles'
    }
  })
  t.deepEqual(rows, [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }])

  await close(db)
  await stopContainer(container)
})
