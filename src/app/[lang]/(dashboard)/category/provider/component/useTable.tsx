import { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import ColumnActions from '@/components/table/column-actions'
import type { IColumns } from '@/types/table'
import type { IProvider } from '@/types/category/typeProvider'

const columnHelper = createColumnHelper<IProvider>()

type IProps = {
  handleEdit: (row: IProvider) => void
  handleDelete: (row: IProvider) => void
  handleLock: (row: IProvider, lock: boolean) => void
}

export const useTableProvider = (props: IProps) => {
  const { handleEdit, handleDelete, handleLock } = props

  const columns = useMemo<IColumns<IProvider>>(
    () => [
      columnHelper.accessor('code', {
        cell: info => info.getValue(),
        header: 'MÃ Nhà cung cấp'
      }),
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: 'TÊN Nhà cung cấp'
      }),
      columnHelper.accessor('note', {
        cell: info => info.getValue(),
        header: 'Ghi chú'
      }),
      {
        id: 'actions',
        cell: info => {
          return (
            <ColumnActions<IProvider>
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
