import { useMemo } from 'react'

import Typography from '@mui/material/Typography'

import { createColumnHelper } from '@tanstack/react-table'

import { toast } from 'react-toastify'

import type { IColumns } from '@/types/table'
import ColumnActions from '@/components/table/column-actions'
import type { IProduct } from '@/types'
import { MESSAGE } from '@/constants/message-response'

const columnHelper = createColumnHelper<IProduct>()

type IProps = {
  handleEdit: (row: IProduct) => void
  handleDelete: (row: IProduct) => void
}

export const useTableProduct = (props: IProps) => {
  const { handleEdit, handleDelete } = props

  const columns = useMemo<IColumns<IProduct>>(
    () => [
      columnHelper.accessor('code', {
        cell: info => info.getValue(),
        header: 'MÃ SẢN PHẨM'
      }),
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: 'TÊN SẢN PHẨM'
      }),
      columnHelper.accessor('description', {
        cell: info => {
          return info.getValue()
        },
        header: 'Đặc tả'
      }),
      columnHelper.accessor('image', {
        cell: info => info.getValue(),
        header: 'Hình ảnh'
      }),
      columnHelper.accessor('size', {
        cell: info => {
          const data = info.row.original.size

          return <Typography>{`${data.height}x${data.width}x${data.length}`} (cm)</Typography>
        },
        header: 'Kích thước',
        minSize: 160
      }),
      columnHelper.accessor('mass', {
        cell: info => info.getValue(),
        header: 'Khối lượng'
      }),
      {
        id: 'actions',
        cell: info => {
          return (
            <ColumnActions<IProduct>
              onDelete={handleDelete}
              onEdit={handleEdit}
              onSwitch={() => {
                toast.error(MESSAGE['status-pending'])
              }}
              row={{ ...info.row.original, lock: true }}
            />
          )
        },
        header: 'thao tác',
        meta: { align: 'center' }
      }
    ],
    [handleDelete, handleEdit]
  )

  return { columns }
}
