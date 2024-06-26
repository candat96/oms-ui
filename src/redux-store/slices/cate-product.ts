import { toast } from 'react-toastify'

import { api } from '@/components/base-query/api'
import { API_CONSTANT } from '@/components/base-query/base-url'
import { mappingData } from '@/utils/mappingData'
import { MESSAGE } from '@/constants/message-response'
import type { IMapping } from '@/utils/mappingData'

const { API_PRODUCT } = API_CONSTANT

interface SupplyResponse {
  meta?: {
    total: number
    [key: string]: any // Bao gồm các thuộc tính meta khác nếu có
  }
  docs: Partial<unknown> | Partial<unknown>[]
}

const cateProduct = api.injectEndpoints({
  endpoints: build => ({
    listProduct: build.query<SupplyResponse, any>({
      query: params => ({ ...params, url: API_PRODUCT }),
      providesTags: [{ type: API_PRODUCT, id: 'LIST' }],
      transformResponse: (response: { [s: string]: unknown }) => {
        const mapper = {
          mapper: {},
          keeps: ['id', 'code', 'name', 'mass', 'image', 'size', 'description'],
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
    createProduct: build.mutation({
      query: data => ({ url: API_PRODUCT, method: 'POST', body: data }),
      invalidatesTags: [{ type: API_PRODUCT, id: 'LIST' }],
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
    updateProduct: build.mutation({
      query: ({ id, ...patch }) => ({ url: `${API_PRODUCT}/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: [{ type: API_PRODUCT, id: 'LIST' }],
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
    removeProduct: build.mutation({
      query: id => ({ url: `${API_PRODUCT}/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: API_PRODUCT, id: 'LIST' }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast.success(MESSAGE['remove-success'])
        } catch (error) {
          toast.success(MESSAGE['remove-failed'])
        }
      }
    }),
    lockProduct: build.mutation({
      query: ({ ...patch }) => ({ url: `${API_PRODUCT}/lock`, method: 'PATCH', body: patch }),
      invalidatesTags: [{ type: API_PRODUCT, id: 'LIST' }],
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
    deletesProduct: build.mutation({
      query: ({ ...patch }) => ({ url: `${API_PRODUCT}/delete/bulk`, method: 'POST', body: patch }),
      invalidatesTags: [{ type: API_PRODUCT, id: 'LIST' }],
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
    createBulkProduct: build.mutation({
      query: data => ({ url: `${API_PRODUCT}/bulk`, method: 'POST', body: data }),
      invalidatesTags: [{ type: API_PRODUCT, id: 'LIST' }],
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
  useListProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useRemoveProductMutation,

  useLockProductMutation,
  useDeletesProductMutation,
  useCreateBulkProductMutation
} = cateProduct
