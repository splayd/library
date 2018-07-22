/* @flow */
import { branchOnClient } from 'rumor-mill/clients'
import SQLBuilder from 'json-sql-builder2'

type CreateIndex = {| $createIndex: {} |}
type CreateTable = {| $createTable: {} |}
type CreateView = {| $createView: {} |}
type Delete = {| $delete: {} |}
type Except = {| $except: {} |}
type Insert = {| $insert: {} |}
type Intersect = {| $intersect: {} |}
type Select = {| $select: {} |}
type Union = {| $union: {} |}
type Update = {| $update: {} |}
type With = {| $with: {} |}

type Query =
  | CreateIndex
  | CreateTable
  | CreateView
  | Delete
  | Except
  | Insert
  | Intersect
  | Select
  | Union
  | Update
  | With

type ParsedQuery = {
  sql: string,
  values: Array<string | number | boolean | null>
}

export default branchOnClient({
  mysql(database, query: Query): ParsedQuery {
    const builder = new SQLBuilder('MySQL')
    return builder.build(query)
  },

  sqlite(database, query: Query): ParsedQuery {
    const builder = new SQLBuilder('SQLite')
    return builder.build(query)
  }
})
