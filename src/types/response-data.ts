export type IResponse<T = unknown> = {
  docs: Array<T>
  meta: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    page: number
    limit: number
    total: number
    totalPage: number
  }
}
