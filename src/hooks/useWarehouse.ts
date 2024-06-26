import { useMemo } from 'react'

import { useListWarehouseQuery } from '@/redux-store/slices/cate-warehouse'
import type { IWarehouse } from '@/types'

export const useWarehouses = () => {
  const warehouse = useListWarehouseQuery({})

  const listWarehouse = useMemo(() => {
    if (warehouse.status === 'pending' || !warehouse.data) return []

    return warehouse.data.docs.map((item: IWarehouse) => ({ value: item.id, label: item.name }))
  }, [warehouse])

  return listWarehouse
}
