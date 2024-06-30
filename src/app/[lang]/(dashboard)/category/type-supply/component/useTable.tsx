import { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import ColumnActions from '@/components/table/column-actions'
import type { ITypeSupply } from '@/types/category/typeSupply'
import type { IColumns } from '@/types/table'

const columnHelper = createColumnHelper<ITypeSupply>()

type IProps = {
  handleEdit: (row: ITypeSupply) => void
  handleDelete: (row: ITypeSupply) => void
  handleLock: (row: ITypeSupply, lock: boolean) => void
}

export const useTableTypeSupply = (props: IProps) => {
  const { handleEdit, handleDelete, handleLock } = props

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
      columnHelper.accessor('description', {
        cell: info => info.getValue(),
        header: 'Mô tả'
      }),
      {
        id: 'actions',
        cell: info => {
          return (
            <ColumnActions<ITypeSupply>
              onDelete={handleDelete}
              onEdit={handleEdit}
              onSwitch={(row, lock) => {
                handleLock(row, lock)
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
