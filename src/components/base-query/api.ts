import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query'
import { createApi } from '@reduxjs/toolkit/query/react'

import { signOut } from 'next-auth/react'

import type { RootState } from '@/redux-store'
import { API_CONSTANT } from './base-url'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.set('tenant-code', process.env.NEXT_PUBLIC_TENANT || '')
    const token = (getState() as RootState).auth.token

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    } else {
      const isWindow = typeof window !== 'undefined'

      if (isWindow) {
        const _token = window.localStorage.getItem('token')

        if (_token) {
          headers.set('authorization', `Bearer ${_token}`)
        }
      }
    }

    return headers
  },
  responseHandler: async response => {
    if (response.status === 401) {
      const isWindow = typeof window !== 'undefined'

      await signOut({ redirect: true })

      if (isWindow) {
        window.localStorage.removeItem('token')
        window.location.hash = '/login'
      }

      return Promise.reject()
    }

    return response.json()
  }
})

export const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 })

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['*', ...Object.values(API_CONSTANT)],
  endpoints: () => ({})
})

export const enhanceApi = api.enhanceEndpoints({
  endpoints: () => ({})
})
