import { toast } from 'react-toastify'

import { api } from '@/components/base-query/api'
import { API_CONSTANT } from '@/components/base-query/base-url'
import { mappingData } from '@/utils/mappingData'
import { MESSAGE } from '@/constants/message-response'
import type { IMapping } from '@/utils/mappingData'

const { API_UNIT } = API_CONSTANT

interface TypeUnitResponse {
  meta?: {
    total: number
    [key: string]: any
  }
  docs: Partial<unknown> | Partial<unknown>[]
}

const cateUnit = api.injectEndpoints({
  endpoints: build => ({
    listUnit: build.query<TypeUnitResponse, any>({
      query: params => ({ ...params, url: API_UNIT }),
      providesTags: [{ type: API_UNIT, id: 'LIST' }],
      transformResponse: (response: { [s: string]: unknown }) => {
        const mapper = {
          mapper: {},
          keeps: ['id', 'code', 'name'],
          handle: (from: { [s: string]: unknown }) => {
            return {
              size: { height: from.height, width: from.width, length: from.length }
            }
          }
        } as unknown as IMapping

        const result = mappingData({ from: response.docs, ...mapper })

        return { ...response, docs: result }
      }
    }),
    createUnit: build.mutation({
      query: data => ({ url: API_UNIT, method: 'POST', body: data }),
      invalidatesTags: [{ type: API_UNIT, id: 'LIST' }],
      async onQueryStarted(_, { queryFulfilled }) {
        await queryFulfilled
          .then(() => {
            toast.success(MESSAGE['create-success'])
          })
          .catch(() => {
            toast.error(MESSAGE['create-failed'])
          })
      }
    }),
    updateUnit: build.mutation({
      query: ({ id, ...patch }) => ({ url: `${API_UNIT}/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: [{ type: API_UNIT, id: 'LIST' }],
      async onQueryStarted(_, { queryFulfilled }) {
        await queryFulfilled
          .then(() => {
            toast.success(MESSAGE['update-success'])
          })
          .catch(() => {
            toast.error(MESSAGE['update-failed'])
          })
      }
    }),
    removeUnit: build.mutation({
      query: id => ({ url: `${API_UNIT}/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: API_UNIT, id: 'LIST' }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast.success(MESSAGE['remove-success'])
        } catch (error) {
          toast.success(MESSAGE['remove-failed'])
        }
      }
    }),
    lockUnit: build.mutation({
      query: ({ ...patch }) => ({ url: `${API_UNIT}/lock`, method: 'POST', body: patch }),
      invalidatesTags: [{ type: API_UNIT, id: 'LIST' }],
      async onQueryStarted(_, { queryFulfilled }) {
        await queryFulfilled
          .then(() => {
            toast.success(MESSAGE['update-success'], {
              autoClose: 3000
            })
          })
          .catch(() => {
            toast.error(MESSAGE['update-failed'], {
              autoClose: 3000
            })
          })
      }
    }),
    deletesUnit: build.mutation({
      query: ({ ...patch }) => ({ url: `${API_UNIT}/delete/bulk`, method: 'POST', body: patch }),
      invalidatesTags: [{ type: API_UNIT, id: 'LIST' }],
      async onQueryStarted(_, { queryFulfilled }) {
        await queryFulfilled
          .then(() => {
            toast.success(MESSAGE['remove-success'], {
              autoClose: 3000
            })
          })
          .catch(() => {
            toast.error(MESSAGE['remove-failed'], {
              autoClose: 3000
            })
          })
      }
    }),
    createBulkUnit: build.mutation({
      query: data => ({ url: `${API_UNIT}/bulk`, method: 'POST', body: data }),
      invalidatesTags: [{ type: API_UNIT, id: 'LIST' }],
      async onQueryStarted(_, { queryFulfilled }) {
        await queryFulfilled
          .then(() => {
            toast.success(MESSAGE['create-success'], {
              autoClose: 3000
            })
          })
          .catch(() => {
            toast.error(MESSAGE['create-failed'], {
              autoClose: 3000
            })
          })
      }
    })
  })
})

export const {
  useListUnitQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useRemoveUnitMutation,

  useLockUnitMutation,
  useDeletesUnitMutation,
  useCreateBulkUnitMutation
} = cateUnit
