import { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import { toast } from 'react-toastify'

import ColumnActions from '@/components/table/column-actions'
import type { IColumns } from '@/types/table'
import type { ITypeSupply } from '@/types/category/typeSupply'
import { MESSAGE } from '@/constants/message-response'

const columnHelper = createColumnHelper<ITypeSupply>()

type IProps = {
  handleEdit: (row: ITypeSupply) => void
  handleDelete: (row: ITypeSupply) => void
}

export const useTableTypeSupply = (props: IProps) => {
  const { handleEdit, handleDelete } = props

  const columns = useMemo<IColumns<ITypeSupply>>(
    () => [
      columnHelper.accessor('code', {
        cell: info => info.getValue(),
        header: 'MÃ LOẠI VẬT TƯ'
      }),
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: 'TÊN LOẠI VẬT TƯ'
      }),
      {
        id: 'actions',
        cell: info => {
          return (
            <ColumnActions<ITypeSupply>
              onDelete={handleDelete}
              onEdit={handleEdit}
              onSwitch={() => {
                toast.error(MESSAGE['status-pending'])
              }}
              row={{ ...info.row.original }}
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
