/* @flow */
import test from 'ava'
import { startContainer, stopContainer } from 'rumor-mill/test/helpers'
import { connectToMysqlDb } from 'rumor-mill/clients'
import { close, sendQuery, buildQuery } from 'rumor-mill/adapters'

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

  const db = await connectToMysqlDb(
    `mysql://user:password@127.0.0.1:${port}/database`
  )

  await sendQuery(db, {
    sql: `
        CREATE TABLE articles (
          id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
          title TEXT NOT NULL
        )
      `,
    values: []
  })
  await sendQuery(db, {
    sql: 'INSERT INTO articles (title) VALUES(?)',
    values: ['Post 1']
  })

  await sendQuery(db, {
    sql: 'INSERT INTO articles (title) VALUES(?)',
    values: ['Post 2']
  })

  const rows = await sendQuery(
    db,
    buildQuery(db, {
      $select: {
        $from: 'articles'
      }
    })
  )
  t.deepEqual(rows, [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }])

  await close(db)
  await stopContainer(container)
})
