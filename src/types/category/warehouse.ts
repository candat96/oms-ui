export type IWarehouse = {
  id: string
  code: string
  name: string
  zone: string
  description: string
  managerId?: string
  manager: {
    id: string
    email: string
    name: string
  }
}
