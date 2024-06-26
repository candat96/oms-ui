import type { SelectOptions } from '..'

export type ILayout = {
  id: string
  code: string
  name: string
  storageId: string | null
  type: ILayoutType | null
  description: string | null
  rows: string
  cols: string
  size: { height: string | null; width: string | null; length: string | null }
  mass: string | null

  rowsDetail?: string[]
  colsDetail?: string[]
}

export enum ILayoutType {
  NORMAL_STORAGE = 'NORMAL_STORAGE',
  COLD_STORAGE = 'COLD_STORAGE'
}
export const ILayoutTypeOptions: SelectOptions<ILayoutType>[] = [
  { value: ILayoutType.NORMAL_STORAGE, label: 'Kho Thường' },
  { value: ILayoutType.COLD_STORAGE, label: 'Kho Lạnh' }
]

export const renderLayoutType = (type: ILayoutType) => {
  return ILayoutTypeOptions.find(item => item.value === type)
}
