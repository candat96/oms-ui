import type { ColumnDef } from '@tanstack/react-table'

export type IHeadCell<T> = {
  [key in keyof T]?: string
} & {
  select?: string
  id: string
  [key: string]: unknown
  actions?: string
}
export enum IMenuFnKey {
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  DELETE = 'DELETE',
  HIDDEN = 'HIDDEN',
  DISPLAY = 'DISPLAY'
}
export type IColumns<T> = Array<ColumnDef<T, any>>
