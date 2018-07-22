/* @flow */
type CreateIndex = {| $createIndex: {} |}

type CreateTable = {|
  $createTable: {
    $table: string,
    $define: {}
  }
|}

type CreateView = {| $createView: {} |}

type Delete = {| $delete: {} |}

type Except = {| $except: {} |}

type Insert = {| $insert: {} |}

type Intersect = {| $intersect: {} |}

type Select = {| $select: {} |}

type Union = {| $union: {} |}

type Update = {| $update: {} |}

type With = {| $with: {} |}

export type Query =
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
