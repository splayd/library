/* @flow */

export type Column = boolean | number | string | Date
export type ColumnType =
  | 'boolean'
  | 'integer'
  | 'float'
  | 'string'
  | 'datetime'
  | 'primary-key'

export function getColumnTypeName(
  columnType: ColumnType,
  clientType: 'mysql' | 'postgresql' | 'sqlite'
): string {
  switch (columnType) {
    case 'boolean':
      return 'boolean'
    case 'integer':
      return 'integer'
    case 'float':
      return 'double precision'
    case 'string':
      return 'text'
    case 'datetime':
      switch (clientType) {
        case 'mysql':
          return 'datetime'
        case 'postgresql':
          return 'timestamp'
        case 'sqlite':
          return 'datetime'
      }
      break
    case 'primary-key':
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
