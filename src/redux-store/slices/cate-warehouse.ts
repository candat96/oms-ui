import { toast } from 'react-toastify'

import { api } from '@/components/base-query/api'
import { API_CONSTANT } from '@/components/base-query/base-url'
import { MESSAGE } from '@/constants/message-response'

const { API_WAREHOUSE } = API_CONSTANT

const cateWarehouse = api.injectEndpoints({
  endpoints: build => ({
    listWarehouse: build.query({
      query: params => ({ ...params, url: API_WAREHOUSE }),
      providesTags: [{ type: API_WAREHOUSE, id: 'LIST' }]
    }),
    getWarehouse: build.query({
      query: id => ({ url: `${API_WAREHOUSE}/${id}` }),
      providesTags: (result, error, id) => [{ type: API_WAREHOUSE, id }]
    }),
    createWarehouse: build.mutation({
      query: data => ({ url: API_WAREHOUSE, method: 'POST', body: data }),
      invalidatesTags: [{ type: API_WAREHOUSE, id: 'LIST' }],
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
    updateWarehouse: build.mutation({
      query: ({ id, ...patch }) => ({
        url: `${API_WAREHOUSE}/${id}`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: [{ type: API_WAREHOUSE, id: 'LIST' }],

      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getWarehouse' as never, id as never, draft => {
            Object.assign(draft, patch)
          })
        )

        try {
          await queryFulfilled
          toast.success(MESSAGE['update-success'])
        } catch {
          toast.error(MESSAGE['update-failed'])
          patchResult.undo()
        }
      }
    }),
    removeWarehouse: build.mutation({
      query: id => ({ url: `${API_WAREHOUSE}/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: API_WAREHOUSE, id: 'LIST' }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast.success(MESSAGE['remove-success'])
        } catch (error) {
          toast.success(MESSAGE['remove-failed'])
        }
      }
    })
  })
})

export const {
  useListWarehouseQuery,
  useGetWarehouseQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useRemoveWarehouseMutation
} = cateWarehouse
