/* @flow */
import test from 'ava'
import { createInMemoryDb, close, sendQuery } from 'rumor-mill'

test('interacting with an in-memory SQLite database', async t => {
  const db = await createInMemoryDb()

  await sendQuery(db, {
    $createTable: {
      $table: 'articles',
      $define: {
        id: { $column: { $type: 'integer', $primary: true, $notNull: true } },
        title: { $column: { $type: 'text', $notNull: true } }
      }
    }
  })

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
})
