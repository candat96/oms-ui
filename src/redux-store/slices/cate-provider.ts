import { toast } from 'react-toastify'

import { api } from '@/components/base-query/api'
import { API_CONSTANT } from '@/components/base-query/base-url'
import { mappingData } from '@/utils/mappingData'
import { MESSAGE } from '@/constants/message-response'
import type { IMapping } from '@/utils/mappingData'

const { API_PROVIDER } = API_CONSTANT

interface ProviderResponse {
  meta?: {
    total: number
    [key: string]: any
  }
  docs: Partial<unknown> | Partial<unknown>[]
}

const cateProvider = api.injectEndpoints({
  endpoints: build => ({
    listProvider: build.query<ProviderResponse, any>({
      query: params => ({ ...params, url: API_PROVIDER }),
      providesTags: [{ type: API_PROVIDER, id: 'LIST' }],
      transformResponse: (response: { [s: string]: unknown }) => {
        const mapper = {
          mapper: {},
          keeps: ['id', 'code', 'name', 'note', 'lock']
        } as unknown as IMapping

        const result = mappingData({ from: response.docs, ...mapper })

        return { ...response, docs: result }
      }
    }),
    createProvider: build.mutation({
      query: data => ({ url: API_PROVIDER, method: 'POST', body: data }),
      invalidatesTags: [{ type: API_PROVIDER, id: 'LIST' }],
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
    updateProvider: build.mutation({
      query: ({ id, ...patch }) => ({ url: `${API_PROVIDER}/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: [{ type: API_PROVIDER, id: 'LIST' }],
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
    removeProvider: build.mutation({
      query: id => ({ url: `${API_PROVIDER}/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: API_PROVIDER, id: 'LIST' }],
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
    lockProvider: build.mutation({
      query: ({ ...patch }) => ({ url: `${API_PROVIDER}/lock`, method: 'POST', body: patch }),
      invalidatesTags: [{ type: API_PROVIDER, id: 'LIST' }],
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
    deletesProvider: build.mutation({
      query: ({ ...patch }) => ({ url: `${API_PROVIDER}/delete/bulk`, method: 'POST', body: patch }),
      invalidatesTags: [{ type: API_PROVIDER, id: 'LIST' }],
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
    createBulkProvider: build.mutation({
      query: data => ({ url: `${API_PROVIDER}/bulk`, method: 'POST', body: data }),
      invalidatesTags: [{ type: API_PROVIDER, id: 'LIST' }],
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
  useListProviderQuery,
  useCreateProviderMutation,
  useUpdateProviderMutation,
  useRemoveProviderMutation,
  useLockProviderMutation,
  useDeletesProviderMutation,
  useCreateBulkProviderMutation
} = cateProvider
