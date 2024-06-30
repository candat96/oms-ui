import { useMemo } from 'react'

import Typography from '@mui/material/Typography'

import { createColumnHelper } from '@tanstack/react-table'

import type { IBasket } from '@/types/category/basket'
import type { IColumns } from '@/types/table'
import ColumnActions from '@/components/table/column-actions'

const columnHelper = createColumnHelper<IBasket>()

type IProps = {
  handleEdit: (row: IBasket) => void
  handleDelete: (row: IBasket) => void
}

export const useTableBasket = (props: IProps) => {
  const { handleEdit, handleDelete } = props

  const columns = useMemo<IColumns<IBasket>>(
    () => [
      columnHelper.accessor('code', {
        cell: info => info.getValue(),
        header: 'Mã Sọt'
      }),
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: 'Tên Sọt'
      }),
      columnHelper.accessor('size', {
        cell: info => {
          const data = info.row.original.size

          return <Typography>{`${data.height}x${data.width}x${data.length}`} (cm)</Typography>
        },
        header: 'kích thước',
        minSize: 160
      }),
      {
        id: 'actions',
        cell: info => {
          return <ColumnActions<IBasket> onDelete={handleDelete} onEdit={handleEdit} row={info.row.original} />
        },
        header: 'thao tác',
        meta: { align: 'center' }
      }
    ],
    [handleDelete, handleEdit]
  )

  return { columns }
}
