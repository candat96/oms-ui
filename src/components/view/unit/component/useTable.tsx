import { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import { toast } from 'react-toastify'

import ColumnActions from '@/components/table/column-actions'
import { MESSAGE } from '@/constants/message-response'
import { useDictionary } from '@/hooks/DictionaryContext'
import type { IUnit } from '@/types/category/unit'
import type { IColumns } from '@/types/table'

const columnHelper = createColumnHelper<IUnit>()

type IProps = {
  handleEdit: (row: IUnit) => void
  handleDelete: (row: IUnit) => void
  // dictionary: Awaited<ReturnType<typeof getDictionary>>
}

export const useTableUnit = (props: IProps) => {
  const { handleEdit, handleDelete } = props
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
              onSwitch={() => {
                toast.error(MESSAGE['status-pending'])
              }}
              row={{ ...info.row.original, lock: true }}
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
