/* @flow */
import type { Column } from 'rumor-mill/interface'
import { branch } from 'rumor-mill/interface'
import { sendSQLQuery } from './'

type Schema = { // eslint-disable-line
  [string]: {
    [string]: Column
  }
}

export default branch /*:: <[], Promise<Schema>> */ ({ // eslint-disable-line
  async mysql(database) {
    const columns = await sendSQLQuery/*:: <{
      tableName: string,
      columnName: string,
      type: string,
      nullable: string,
      columnKey: string
    }> */(database, {
      sql: `
        SELECT
          c.table_name as tableName,
          c.column_name as columnName,
          c.data_type as type,
          c.is_nullable as nullable,
          c.column_key as columnKey
        FROM information_schema.columns c
        WHERE c.table_schema <> 'information_schema'
        `,
      values: []
    })

    const schema = {}
    for (const { tableName, columnName, type, columnKey } of columns) {
      if (!(tableName in schema)) {
        schema[tableName] = {}
      }

      if (columnKey === 'PRI') {
        schema[tableName][columnName] = 'primary-key'
      } else if (type === 'tinyint') {
        schema[tableName][columnName] = 'boolean'
      } else if (type === 'int') {
        schema[tableName][columnName] = 'integer'
      } else if (type === 'double') {
        schema[tableName][columnName] = 'float'
      } else if (type === 'text') {
        schema[tableName][columnName] = 'string'
      } else {
        schema[tableName][columnName] = type
      }
    }

    return schema
  },

  async postgresql(database) {
    const columns = await sendSQLQuery/*:: <{
      table: string,
      column: string,
      type: string,
      nullable: string,
      constraint: ?string
    }> */(database, {
      sql: `
        SELECT
          c.table_name AS table,
          c.column_name AS column,
          c.data_type AS type,
          c.is_nullable AS nullable,
          tc.constraint_type AS constraint
        FROM information_schema.columns c
        LEFT JOIN information_schema.constraint_column_usage
          AS ccu
          ON ccu.table_schema = c.table_schema
          AND ccu.table_name = c.table_name
          AND ccu.column_name = c.column_name
        LEFT JOIN information_schema.table_constraints
          AS tc
          ON tc.table_schema = ccu.table_schema
          AND tc.table_name = ccu.table_name 
          AND tc.constraint_name = ccu.constraint_name
        WHERE
          c.table_schema = 'public'
        `,
      values: []
    })

    const schema = {}
    for (const { table, column, type, constraint } of columns) {
      if (!(table in schema)) {
        schema[table] = {}
      }

      if (constraint === 'PRIMARY KEY') {
        schema[table][column] = 'primary-key'
      } else if (type === 'double precision') {
        schema[table][column] = 'float'
      } else if (type === 'text') {
        schema[table][column] = 'string'
      } else if (type === 'timestamp without time zone') {
        schema[table][column] = 'datetime'
      } else {
        schema[table][column] = type
      }
    }

    return schema
  },

  async sqlite(database) {
    const columns = await sendSQLQuery/*:: <{
      tableName: string,
      columnName: string,
      columnType: string,
      isPrimaryKey: boolean
    }> */(database, {
      sql: `
          SELECT
            m.name AS tableName,
            p.name AS columnName,
            p.type AS columnType,
            p.'notnull' AS 'notNull',
            p.pk AS isPrimaryKey
          FROM
            sqlite_master AS m
          JOIN
            pragma_table_info(tableName) AS p
          ORDER BY
            tableName
        `,
      values: []
    })

    const schema = {}
    for (const { tableName, columnName, columnType, isPrimaryKey } of columns) {
      if (!(tableName in schema)) {
        schema[tableName] = {}
      }

      if (isPrimaryKey) {
        schema[tableName][columnName] = 'primary-key'
      } else if (columnType === 'double precision') {
        schema[tableName][columnName] = 'float'
      } else if (columnType === 'text') {
        schema[tableName][columnName] = 'string'
      } else {
        schema[tableName][columnName] = columnType
      }
    }

    return schema
  }
})
