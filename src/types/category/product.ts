export type IProduct = {
  id: string
  code: string
  name: string
  description: string
  staff: string | null
  image: string | null
  size: { height: string | null; width: string | null; length: string | null }
  mass: string | null
}
