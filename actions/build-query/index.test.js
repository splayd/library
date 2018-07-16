/* @flow */
import test from 'ava'
import { buildQuery } from 'rumor-mill'

test('building SQL queries', t => {
  t.deepEqual(
    buildQuery('SQLite', {
      $select: { $from: 'articles' }
    }),
    {
      sql: 'SELECT * FROM articles',
      values: []
    }
  )

  t.deepEqual(
    buildQuery('SQLite', {
      $select: {
        $from: 'articles',
        $where: {
          title: 'Post 1'
        }
      }
    }),
    {
      sql: 'SELECT * FROM articles WHERE title = ?',
      values: ['Post 1']
    }
  )
})
