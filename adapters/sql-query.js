/* @flow */
export type SQLQuery = {
  sql: string,
  values: Array<string | number | boolean | null>
}
