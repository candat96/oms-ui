import type { ReactNode } from 'react'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Link from 'next/link'

import _ from 'lodash'
import classnames from 'classnames'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import type { TextFieldProps } from '@mui/material/TextField'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  FilterFn,
  RowData,
  RowSelectionState,
  Table
} from '@tanstack/react-table'

import styles from './table.module.css'
import BtnMenu from '../menu/btn-menu'
import { IMenuFnKey } from '@/types/table'
import ChevronRight from '@/@menu/svg/ChevronRight'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }

  interface TableMeta<TData extends RowData> {
    title?: string
    info?: string
    align?: AlignSetting
    type?: 'text' | 'date' | 'select' | 'img' | 'input'
    editable?: boolean | ((row: TData) => boolean)
    hidden?: boolean | ((row: TData) => boolean)
    required?: boolean
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void
  }

  interface ColumnMeta<TData extends RowData, TValue = unknown> {
    title?: string
    info?: string
    align?: AlignSetting
    type?: 'text' | 'date' | 'select' | 'img' | 'input'
    editable?: boolean | ((row: TData) => boolean)
    hidden?: boolean | ((row: TData) => boolean)
    required?: boolean
    updateData?: (rowIndex: number, columnId: string, value: TValue) => void
  }
}

type ITableProps<T> = {
  data: Array<T>
  columns: Array<ColumnDef<T, unknown>>
  title?: string
  header?: {
    search?: boolean
    filter?: boolean
    expand?: boolean
    select?: boolean
    overwrite?: {
      filter?: ReactNode
      action?: ReactNode
    }
    create?: { fn?: () => void; href?: string; title?: string }
    action?: ReactNode
    cardInfo?: ReactNode
    menus?: {
      [s: string]: { fn: (target: IMenuFnKey, value: unknown) => void }
    }
  }
  footer?: {
    cardInfo?: ReactNode
    pagination?: boolean
    paginate?: {
      page: number
      limit: number
      total: number
      onPage: (page: number) => void
      onRow: (limit: number) => void
    }
  }
}

function TableCore<T = { [s: string]: unknown }>(props: ITableProps<T>) {
  const { data, columns } = props
  const [globalFilter, setGlobalFilter] = useState('')

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { items } = useListItem({ menus: props.header?.menus, value: rowSelection })

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  useEffect(() => {
    if (data && props.header?.expand) {
      setExpanded(() => {
        const exp = {}

        data.forEach((_: unknown, idx: number) => {
          Object.assign(exp, { [idx]: true })
        })

        return exp
      })
    }
  }, [data, props.header?.expand])

  useEffect(() => {
    setRowSelection({})
  }, [data])

  const convertColumns = useMemo(() => {
    let actions: ColumnDef<T, unknown>[] = [...columns]

    if (props.header?.select) {
      const item: ColumnDef<T, unknown> = {
        id: 'select',
        header: ({ table }) => {
          return (
            <Checkbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler()
              }}
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          )
        },
        size: 34
      }

      if (actions.some(col => col.id === 'select')) {
        actions = actions.map(act => {
          if (act.id === 'select') return { ...act, ...item }

          return act
        })
      } else {
        actions = [item, ...actions]
      }
    }

    if (props.header?.expand) {
      const item: ColumnDef<T, unknown> = {
        id: 'expand',
        header: ({ table }) => {
          return (
            <IconButton size='small' onClick={() => table.toggleAllRowsExpanded()}>
              {table.getIsAllRowsExpanded() ? (
                <i className='ri-arrow-down-s-line'></i>
              ) : (
                <i className='ri-arrow-right-s-line'></i>
              )}
            </IconButton>
          )
        },
        cell: ({ row }) => {
          if (row.getCanExpand())
            return (
              <IconButton size='small' onClick={() => row.toggleExpanded()}>
                {row.getIsExpanded() ? (
                  <i className='ri-arrow-down-s-line'></i>
                ) : (
                  <i className='ri-arrow-right-s-line'></i>
                )}
              </IconButton>
            )

          return <></>
        },
        size: 34
      }

      if (actions.some(col => col.id === 'expand')) {
        actions = actions.map(act => {
          if (act.id === 'expand') return { ...act, ...item }

          return act
        })
      } else {
        actions = [item, ...actions]
      }
    }

    return actions
  }, [columns, props.header?.expand, props.header?.select]) as ColumnDef<T, unknown>[]

  const table = useReactTable<T>({
    data,
    columns: convertColumns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { columnFilters, globalFilter, expanded, rowSelection },
    getCoreRowModel: getCoreRowModel(),

    // expanded change
    enableExpanding: Boolean(props.header?.expand),
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    // @ts-ignore
    getSubRows: row => row?.subRows,

    // row selection
    enableRowSelection: Boolean(props.header?.select),
    onRowSelectionChange: setRowSelection,
    getRowId: (row: any) => row?.id || '',
    // filters change
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),

    // more change
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    autoResetPageIndex,

    meta: {
      updateData: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex()
        console.log({ rowIndex, columnId, value })
      }
    },
    debugTable: true
  })

  return (
    <Card>
      {props.header?.cardInfo && (
        <CardContent
          sx={{
            m: 5,
            borderRadius: 1.25,
            backgroundColor: 'var(--mui-palette-customColors-tableHeaderBg)'
          }}
        >
          {props.header.cardInfo}
        </CardContent>
      )}
      <CardHeader
        className='flex flex-wrap gap-4'
        title={
          (props.header?.overwrite?.filter || props.header?.search !== false || props.header?.overwrite?.action) && (
            <section className='flex flex-wrap gap-4'>
              {props.header?.overwrite?.filter && (
                <section className='w-full sm:w-auto'>{props.header.overwrite.filter}</section>
              )}
              {props.header?.search !== false && (
                <section className='w-full sm:w-auto'>
                  <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    placeholder='Tìm kiếm nhanh...'
                  />
                </section>
              )}
              {props.header?.overwrite?.action && (
                <section className='w-full sm:w-auto'>{props.header.overwrite.action}</section>
              )}
            </section>
          )
        }
        action={
          (props.header?.action || props.header?.create || props.header?.menus) && (
            <section className='flex justify-end gap-4 items-center flex-wrap'>
              {props?.header?.action && props.header.action}
              {props.header?.create && (
                <Button
                  LinkComponent={Link}
                  onClick={props.header.create.fn}
                  href={props.header.create.href}
                  variant='contained'
                  startIcon={<i className='ri-add-circle-fill text-lg' />}
                >
                  {props.header.create.title ?? 'Thêm mới'}
                </Button>
              )}
              {props?.header?.menus && <BtnMenu buttonProps={{ color: 'primary' }} items={items} />}
            </section>
          )
        }
      />
      <section className='overflow-x-auto px-5'>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const { align } = header.column.columnDef.meta || {}
                  const width = header.getSize()
                  const maxWidth = header.column.columnDef.maxSize
                  const minWidth = header.column.columnDef.minSize

                  return (
                    <th key={header.id} style={{ textAlign: align, width, maxWidth, minWidth }}>
                      {header.isPlaceholder ? null : (
                        <>
                          {props.header?.filter === false || header.column.id === 'expand' ? (
                            <div
                              className={classnames({
                                'flex items-center': header.column.getIsSorted(),
                                'cursor-pointer select-none': header.column.getCanSort()
                              })}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                                desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
                              }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                            </div>
                          ) : (
                            header.column.getCanFilter() && <Filter column={header.column} size={width} table={table} />
                          )}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>

          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  Không có dữ liệu
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map(row => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      const { align: textAlign } = cell.column.columnDef.meta || {}
                      const width = cell.column.columnDef.size
                      const maxWidth = cell.column.columnDef.maxSize
                      const minWidth = cell.column.columnDef.minSize

                      return (
                        <td key={cell.id} style={{ textAlign, maxWidth, minWidth, width, textWrap: 'wrap' }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>
      </section>

      <Divider />
      <section className='flex flex-wrap gap-x-4 justify-between items-center'>
        {props.footer?.cardInfo && props.footer.cardInfo}
        {props.footer?.pagination !== false && (
          <section className='px-3'>
            <TablePagination
              sx={{ flex: 1, border: 'none' }}
              rowsPerPageOptions={[7, 10, 25, { label: 'Tất cả', value: props.footer?.paginate?.total || 999999 }]}
              component='section'
              className='border-bs'
              count={props.footer?.paginate?.total || table.getFilteredRowModel().rows.length}
              rowsPerPage={props.footer?.paginate?.limit || table.getState().pagination.pageSize}
              page={
                props.footer?.paginate?.page ? props.footer.paginate.page - 1 : table.getState().pagination.pageIndex
              }
              onPageChange={(_, page) => {
                if (props.footer?.paginate) {
                  props.footer.paginate.onPage(page + 1)
                }

                table.setPageIndex(page)
              }}
              onRowsPerPageChange={e => {
                if (props.footer?.paginate) {
                  props.footer.paginate.onRow(Number(e.target.value))
                }

                table.setPageSize(Number(e.target.value))
              }}
              labelRowsPerPage='Bản ghi:'
            />
          </section>
        )}
      </section>
    </Card>
  )
}

export default TableCore

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({ itemRank })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const Filter = ({ column, table, size }: { size: number; column: Column<any, unknown>; table: Table<any> }) => {
  // Vars
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className='flex gap-x-2'>
      <TextField
        fullWidth
        type='number'
        size='small'
        // sx={{ minInlineSize: 100, maxInlineSize: 125 }}
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e => column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])}
        placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
      />
      <TextField
        fullWidth
        type='number'
        size='small'
        // sx={{ minInlineSize: 100, maxInlineSize: 125 }}
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e => column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])}
        placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
      />
    </div>
  ) : (
    <TextField
      fullWidth
      size='small'
      sx={{ minInlineSize: size === 150 ? 130 : size }}
      value={(columnFilterValue ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder={column.columnDef.header?.toString() || 'Tìm kiếm...'}
    />
  )
}

// A debounced input react component
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & TextFieldProps) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField fullWidth {...props} size='small' value={value} onChange={e => setValue(e.target.value)} />
}

// A list action
const useListItem = (props: {
  menus?: {
    [s: string]: { fn: (target: IMenuFnKey, value?: unknown) => void }
  }
  value?: unknown
}) => {
  const { menus, value } = props

  const items = useMemo(() => {
    if (!menus) return []

    return [
      menus[IMenuFnKey.EXPORT] && {
        fn: () => menus[IMenuFnKey.EXPORT].fn(IMenuFnKey.EXPORT, value),
        children: (
          <>
            <ListItemIcon>
              <i className='ri-export-fill text-[#666cff]' />
            </ListItemIcon>
            <ListItemText primary='Export' />
          </>
        )
      },
      menus[IMenuFnKey.IMPORT] && {
        fn: () => menus[IMenuFnKey.IMPORT].fn(IMenuFnKey.IMPORT),
        children: (
          <>
            <ListItemIcon>
              <i className='ri-import-fill text-[#666cff]' />
            </ListItemIcon>
            <ListItemText primary='Import' />
          </>
        )
      },
      menus[IMenuFnKey.HIDDEN] && {
        fn: () => menus[IMenuFnKey.HIDDEN].fn(IMenuFnKey.HIDDEN, value),
        children: (
          <>
            <ListItemIcon>
              <i className='ri-eye-off-fill text-[#666cff]' />
            </ListItemIcon>
            <ListItemText primary='Hidden' />
          </>
        )
      },
      menus[IMenuFnKey.DISPLAY] && {
        fn: () => menus[IMenuFnKey.DISPLAY].fn(IMenuFnKey.DISPLAY, value),
        children: (
          <>
            <ListItemIcon>
              <i className='ri-eye-fill text-[#666cff]' />
            </ListItemIcon>
            <ListItemText primary='Display' />
          </>
        )
      },
      menus[IMenuFnKey.DELETE] && {
        fn: () => menus[IMenuFnKey.DELETE].fn(IMenuFnKey.DELETE, value),
        children: (
          <>
            <ListItemIcon>
              <i className='ri-delete-bin-fill text-[#666cff]' />
            </ListItemIcon>
            <ListItemText primary='Delete' />
          </>
        )
      }
    ].filter(item => !_.isEmpty(item))
  }, [menus, value])

  return { items }
}

const useSkipper = () => {
  const shouldSkipRef = useRef(true)
  const shouldSkip = shouldSkipRef.current

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip] as const
}
