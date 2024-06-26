import { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import ColumnActions from '@/components/table/column-actions'
import type { IColumns } from '@/types/table'
import type { IUnit } from '@/types/category/unit'

const columnHelper = createColumnHelper<IUnit>()

type IProps = {
  handleEdit: (row: IUnit) => void
  handleDelete: (row: IUnit) => void
}

export const useTableUnit = (props: IProps) => {
  const { handleEdit, handleDelete } = props

  const columns = useMemo<IColumns<IUnit>>(
    () => [
      columnHelper.accessor('code', {
        cell: info => info.getValue(),
        header: 'MÃ ĐƠN VỊ'
      }),
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: 'TÊN ĐƠN VỊ'
      }),
      {
        id: 'actions',
        cell: info => {
          return <ColumnActions<IUnit> onDelete={handleDelete} onEdit={handleEdit} row={info.row.original} />
        },
        header: 'thao tác',
        meta: { align: 'center' }
      }
    ],
    [handleDelete, handleEdit]
  )

  return { columns }
}
