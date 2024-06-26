import { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import ColumnActions from '@/components/table/column-actions'
import { useDictionary } from '@/hooks/DictionaryContext'
import type { IUnit } from '@/types/category/unit'
import type { IColumns } from '@/types/table'

const columnHelper = createColumnHelper<IUnit>()

type IProps = {
  handleEdit: (row: IUnit) => void
  handleDelete: (row: IUnit) => void
  handleLock: (row: IUnit, lock: boolean) => void
}

export const useTableUnit = (props: IProps) => {
  const { handleEdit, handleDelete, handleLock } = props
  const dictionary = useDictionary()

  const columns = useMemo<IColumns<IUnit>>(
    () => [
      columnHelper.accessor('code', {
        cell: info => info.getValue(),
        header: dictionary['unit'].code
      }),
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: dictionary['unit'].name
      }),
      {
        id: 'actions',
        cell: info => {
          return (
            <ColumnActions<IUnit>
              onDelete={handleDelete}
              onEdit={handleEdit}
              onSwitch={(row, lock) => {
                handleLock(row, lock)
              }}
              row={{ ...info.row.original }}
            />
          )
        },
        header: dictionary['common'].manipulation,
        meta: { align: 'center' }
      }
    ],
    [handleDelete, handleEdit]
  )

  return { columns }
}
