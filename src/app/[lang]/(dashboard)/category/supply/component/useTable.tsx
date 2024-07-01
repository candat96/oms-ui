import { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import { Typography } from '@mui/material'

import ColumnActions from '@/components/table/column-actions'

import type { ISupply } from '@/types'

import type { IColumns } from '@/types/table'

const columnHelper = createColumnHelper<ISupply>()

type IProps = {
  handleEdit: (row: ISupply) => void
  handleDelete: (row: ISupply) => void
}

export const useTableSupply = (props: IProps) => {
  const { handleEdit, handleDelete } = props

  const columns = useMemo<IColumns<ISupply>>(
    () => [
      columnHelper.accessor('code', {
        cell: info => info.getValue(),
        header: 'Mã vật tư',
        size: 100
      }),
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: 'Tên vật tư',
        size: 120
      }),
      columnHelper.accessor('type', {
        cell: info => info.getValue(),
        header: 'Loại vật tư',
        meta: { align: 'center' },
        size: 70
      }),
      columnHelper.accessor('unit', {
        cell: info => info.getValue(),
        header: 'Đơn vị'
      }),
      columnHelper.accessor('size', {
        cell: info => {
          const data = info.row.original.size

          return <Typography>{`${data.height}x${data.width}x${data.length}`} (cm)</Typography>
        },
        header: 'Kích thước',
        size: 100
      }),
      columnHelper.accessor('description', {
        cell: info => info.getValue(),
        header: 'Mô tả',
        size: 100
      }),
      {
        id: 'actions',
        cell: info => {
          return <ColumnActions<ISupply> onEdit={handleEdit} onDelete={handleDelete} row={info.row.original} />
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
