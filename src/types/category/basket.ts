export type IBasket = {
  id: string
  code: string
  name: string
  size: { height: string | null; width: string | null; length: string | null }
}
