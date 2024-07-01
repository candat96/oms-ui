export type ISupply = {
  id: string
  code: string
  name: string
  description: string
  unit: string
  staff: string | null
  size: { height: number | string | null; width: number | string | null; length: number | string | null }
  mass: number | string | null
  type?: number | null | string
  typeId?: string
  unitId?: string
}
