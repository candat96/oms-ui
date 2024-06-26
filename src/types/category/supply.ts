export type ISupply = {
  id: string
  code: string
  name: string
  type: string
  description: string
  unit: string
  staff: string | null
  size: { height: number | null; width: number | null; length: number | null }
  mass: number | null
}
