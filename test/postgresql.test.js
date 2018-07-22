/* @flow */
import test from 'ava'
import { startContainer, stopContainer } from 'rumor-mill/test/helpers'
import { connectToPostgresqlDb, close, sendQuery } from 'rumor-mill'

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

  const db = await connectToPostgresqlDb(
    `postgresql://user:password@127.0.0.1:${port}/database`
  )

  await sendQuery(db, {
    $createTable: {
      $table: 'articles',
      $define: {
        id: {
          $column: {
            $type: 'integer',
            $primary: true,
            $notNull: true
          }
        },
        title: { $column: { $type: 'text', $notNull: true } }
      }
    }
  })

  await sendQuery(db, {
    $insert: {
      $table: 'articles',
      $columns: ['id', 'title'],
      $values: [1, 'Post 1']
    }
  })

  await sendQuery(db, {
    $insert: {
      $table: 'articles',
      $columns: ['id', 'title'],
      $values: [2, 'Post 2']
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