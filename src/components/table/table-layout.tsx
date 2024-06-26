import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { rankItem } from '@tanstack/match-sorter-utils'

import styles from './table.module.css'

type ITableProps<T> = {
  data: Array<T>
  columns: Array<ColumnDef<T, unknown>>
}

function TableLayout<T = { [s: string]: unknown }>(props: ITableProps<T>) {
  const { data, columns } = props

  const table = useReactTable<T>({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <section className='overflow-x-auto px-5'>
      <table className={styles.table}>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default TableLayout

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({ itemRank })

  // Return if the item should be filtered in/out
  return itemRank.passed
}
