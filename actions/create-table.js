/* @flow */
import type { Database } from 'rumor-mill/clients'
import { getClientType } from 'rumor-mill/clients'
import { sendQuery } from 'rumor-mill/actions'
import { fromPairs } from 'lodash'

type PrimaryKey = { name: string, type: 'primaryKey', allowNull?: empty }

type Data = {
  name: string,
  type: 'boolean' | 'integer' | 'float' | 'string' | 'datetime',
  allowNull?: boolean
}

type Column = PrimaryKey | Data

const types = {
  mysql: {
    boolean: 'boolean',
    integer: 'integer',
    float: 'double precision',
    string: 'text',
    datetime: 'datetime'
  },
  postgresql: {
    boolean: 'boolean',
    integer: 'integer',
    float: 'double precision',
    string: 'text',
    datetime: 'timestamp'
  },
  sqlite: {
    boolean: 'boolean',
    integer: 'integer',
    float: 'double precision',
    string: 'text',
    datetime: 'datetime'
  }
}

const primaryKey = {
  mysql: {
    $column: {
      $type: 'integer',
      $primary: true,
      $notNull: true,
      $autoInc: true
    }
  },
  postgresql: { $column: { $type: 'serial', $primary: true, $notNull: true } },
  sqlite: { $column: { $type: 'integer', $primary: true, $notNull: true } }
}

export default async function(
  database: Database,
  tableName: string,
  columns: Array<Column>
): Promise<void> {
  const clientType = getClientType(database)

  await sendQuery(database, {
    $createTable: {
      $table: tableName,
      $define: fromPairs(
        columns.map(({ name, type, allowNull = false }) => {
          if (type === 'primaryKey') {
            return [name, primaryKey[clientType]]
          } else {
            return [
              name,
              {
                $column: {
                  $type: types[clientType][type],
                  $notNull: !allowNull
                }
              }
            ]
          }
        })
      )
    }
  })
}
