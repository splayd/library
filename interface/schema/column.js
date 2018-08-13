/* @flow */

export type Column = boolean | number | string | Date

export const columnTypes = {
  boolean: true,
  integer: 0,
  float: 0.5,
  string: '',
  datetime: new Date(),
  primaryKey: 1
}

export function getColumnTypeName(
  columnType: $Values<typeof columnTypes>,
  clientType: 'mysql' | 'postgresql' | 'sqlite'
): string {
  switch (columnType) {
    case columnTypes.boolean:
      return 'boolean'
    case columnTypes.integer:
      return 'integer'
    case columnTypes.float:
      return 'double precision'
    case columnTypes.string:
      return 'text'
    case columnTypes.datetime:
      switch (clientType) {
        case 'mysql':
          return 'datetime'
        case 'postgresql':
          return 'timestamp'
        case 'sqlite':
          return 'datetime'
      }
      break
    case columnTypes.primaryKey:
      switch (clientType) {
        case 'mysql':
          return 'integer auto_increment primary key'
        case 'postgresql':
          return 'serial primary key'
        case 'sqlite':
          return 'integer primary key'
      }
      break
  }

  throw new Error('Unexpected Input')
}
