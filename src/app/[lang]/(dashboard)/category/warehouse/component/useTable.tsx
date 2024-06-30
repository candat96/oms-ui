import { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import ColumnActions from '@/components/table/column-actions'
import { ColumnTextLine } from '@/components/table/column-text-line'

import type { IWarehouse } from '@/types'

import type { IColumns } from '@/types/table'

const columnHelper = createColumnHelper<IWarehouse>()

type IProps = {
  handleEdit: (row: IWarehouse) => void
  handleDelete: (row: IWarehouse) => void
}

export const useTableWarehouse = (props: IProps) => {
  const { handleEdit, handleDelete } = props

  const columns = useMemo<IColumns<IWarehouse>>(
    () => [
      columnHelper.accessor('code', {
        cell: info => info.getValue(),
        header: 'mã kho',
        size: 100
      }),
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: 'tên kho',
        size: 120
      }),
      columnHelper.accessor('zone', {
        cell: info => info.getValue(),
        header: 'số zone',
        meta: { align: 'center' },
        size: 70
      }),
      columnHelper.accessor('description', {
        cell: info => <ColumnTextLine>{info.getValue()}</ColumnTextLine>,
        header: 'mô tả'
      }),
      columnHelper.accessor('manager', {
        cell: info => info.getValue().name,
        header: 'nv quản lý',
        size: 100
      }),
      {
        id: 'actions',
        cell: info => {
          return <ColumnActions<IWarehouse> onEdit={handleEdit} onDelete={handleDelete} row={info.row.original} />
        },
        header: 'thao tác',
        meta: { align: 'center' },
        size: 100
      }
    ],
    [handleEdit, handleDelete]
  )

  return { columns }
}
