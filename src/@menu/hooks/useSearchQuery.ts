// useSearchQuery.ts
import { useState } from 'react'

export const useSearchQuery = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    order: 'ASC',
    search_string: ''
  })

  const handleOnPage = (page: number) => {
    setParams(params => ({ ...params, page }))
  }

  const handleOnLimit = (limit: number) => {
    setParams(params => ({ ...params, limit }))
  }

  const handleOnOrder = (order: 'ASC' | 'DESC') => {
    setParams(params => ({ ...params, order }))
  }

  return { params, handleOnLimit, handleOnOrder, handleOnPage }
}
