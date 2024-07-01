import { toast } from 'react-toastify'

import { api } from '@/components/base-query/api'
import { API_CONSTANT } from '@/components/base-query/base-url'
import { mappingData } from '@/utils/mappingData'
import { MESSAGE } from '@/constants/message-response'
import type { IMapping } from '@/utils/mappingData'

const { API_SUPPLY } = API_CONSTANT

interface SupplyResponse {
  meta?: {
    total: number
    [key: string]: any // Bao gồm các thuộc tính meta khác nếu có
  }
  docs: Partial<unknown> | Partial<unknown>[]
}

const cateSupply = api.injectEndpoints({
  endpoints: build => ({
    listSupply: build.query<SupplyResponse, any>({
      query: params => ({ ...params, url: API_SUPPLY }),
      providesTags: [{ type: API_SUPPLY, id: 'LIST' }],
      transformResponse: (response: { [s: string]: unknown }) => {
        const mapper = {
          mapper: {},
          keeps: ['id', 'code', 'name', 'lock', 'description', 'mass', 'type', 'unit', 'typeId', 'unitId'],
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
    createSupply: build.mutation({
      query: data => ({ url: API_SUPPLY, method: 'POST', body: data }),
      invalidatesTags: [{ type: API_SUPPLY, id: 'LIST' }],
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
    updateSupply: build.mutation({
      query: ({ id, ...patch }) => ({ url: `${API_SUPPLY}/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: [{ type: API_SUPPLY, id: 'LIST' }],
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
    removeSupply: build.mutation({
      query: id => ({ url: `${API_SUPPLY}/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: API_SUPPLY, id: 'LIST' }],
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
    lockSupply: build.mutation({
      query: ({ ...patch }) => ({ url: `${API_SUPPLY}/lock`, method: 'POST', body: patch }),
      invalidatesTags: [{ type: API_SUPPLY, id: 'LIST' }],
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
    deletesSupply: build.mutation({
      query: ({ ...patch }) => ({ url: `${API_SUPPLY}/delete/bulk`, method: 'POST', body: patch }),
      invalidatesTags: [{ type: API_SUPPLY, id: 'LIST' }],
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
    createBulkSupply: build.mutation({
      query: data => ({ url: `${API_SUPPLY}/bulk`, method: 'POST', body: data }),
      invalidatesTags: [{ type: API_SUPPLY, id: 'LIST' }],
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
  useListSupplyQuery,
  useCreateSupplyMutation,
  useUpdateSupplyMutation,
  useRemoveSupplyMutation,
  useLockSupplyMutation,
  useDeletesSupplyMutation,
  useCreateBulkSupplyMutation
} = cateSupply
