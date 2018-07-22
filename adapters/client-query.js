/* @flow */
export type ClientQuery = {
  sql: string,
  values: Array<string | number | boolean | null>
}
