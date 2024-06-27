import { toast } from 'react-toastify'

import { api } from '@/components/base-query/api'
import { API_CONSTANT } from '@/components/base-query/base-url'
import { mappingData } from '@/utils/mappingData'
import { MESSAGE } from '@/constants/message-response'
import type { IMapping } from '@/utils/mappingData'

const { API_TYPE_SUPPLY } = API_CONSTANT

interface TypeSupplyResponse {
  meta?: {
    total: number
    [key: string]: any // Bao gồm các thuộc tính meta khác nếu có
  }
  docs: Partial<unknown> | Partial<unknown>[]
}

const cateTypeSupply = api.injectEndpoints({
  endpoints: build => ({
    listTypeSupply: build.query<TypeSupplyResponse, any>({
      query: params => ({ ...params, url: API_TYPE_SUPPLY }),
      providesTags: [{ type: API_TYPE_SUPPLY, id: 'LIST' }],
      transformResponse: (response: { [s: string]: unknown }) => {
        const mapper = {
          mapper: {},
          keeps: ['id', 'code', 'name', 'lock', 'description']
        } as unknown as IMapping

        const result = mappingData({ from: response.docs, ...mapper })

        return { ...response, docs: result }
      }
    }),
    createTypeSupply: build.mutation({
      query: data => ({ url: API_TYPE_SUPPLY, method: 'POST', body: data }),
      invalidatesTags: [{ type: API_TYPE_SUPPLY, id: 'LIST' }],
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
    }),
    updateTypeSupply: build.mutation({
      query: ({ id, ...patch }) => ({ url: `${API_TYPE_SUPPLY}/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: [{ type: API_TYPE_SUPPLY, id: 'LIST' }],
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
    removeTypeSupply: build.mutation({
      query: id => ({ url: `${API_TYPE_SUPPLY}/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: API_TYPE_SUPPLY, id: 'LIST' }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast.success(MESSAGE['remove-success'], {
            autoClose: 3000
          })
        } catch (error) {
          toast.success(MESSAGE['remove-failed'], {
            autoClose: 3000
          })
        }
      }
    }),
    lockTypeSupply: build.mutation({
      query: ({ ...patch }) => ({ url: `${API_TYPE_SUPPLY}/lock`, method: 'PATCH', body: patch }),
      invalidatesTags: [{ type: API_TYPE_SUPPLY, id: 'LIST' }],
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
    deletesTypeSupply: build.mutation({
      query: ({ ...patch }) => ({ url: `${API_TYPE_SUPPLY}/delete/bulk`, method: 'POST', body: patch }),
      invalidatesTags: [{ type: API_TYPE_SUPPLY, id: 'LIST' }],
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
    createBulkTypeSupply: build.mutation({
      query: data => ({ url: `${API_TYPE_SUPPLY}/bulk`, method: 'POST', body: data }),
      invalidatesTags: [{ type: API_TYPE_SUPPLY, id: 'LIST' }],
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
  useListTypeSupplyQuery,
  useCreateTypeSupplyMutation,
  useUpdateTypeSupplyMutation,
  useRemoveTypeSupplyMutation,
  useLockTypeSupplyMutation,
  useDeletesTypeSupplyMutation,
  useCreateBulkTypeSupplyMutation
} = cateTypeSupply
