export type IExample = {
  id: string
  name: string
  point: number
  status: boolean
}

export type IExampleType = {
  data: IExample[]
  currentExpId?: string
}
