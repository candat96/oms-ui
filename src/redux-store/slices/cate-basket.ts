import { toast } from 'react-toastify'

import { api } from '@/components/base-query/api'
import { API_CONSTANT } from '@/components/base-query/base-url'
import { mappingData } from '@/utils/mappingData'
import { MESSAGE } from '@/constants/message-response'
import type { IMapping } from '@/utils/mappingData'

const { API_BASKET } = API_CONSTANT

const cateBasket = api.injectEndpoints({
  endpoints: build => ({
    listBasket: build.query({
      query: params => ({ ...params, url: API_BASKET }),
      providesTags: [{ type: API_BASKET, id: 'LIST' }],
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
    createBasket: build.mutation({
      query: data => ({ url: API_BASKET, method: 'POST', body: data }),
      invalidatesTags: [{ type: API_BASKET, id: 'LIST' }],
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
    updateBasket: build.mutation({
      query: ({ id, ...patch }) => ({ url: `${API_BASKET}/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: [{ type: API_BASKET, id: 'LIST' }],
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
    removeBasket: build.mutation({
      query: id => ({ url: `${API_BASKET}/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: API_BASKET, id: 'LIST' }],
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

export const { useListBasketQuery, useCreateBasketMutation, useUpdateBasketMutation, useRemoveBasketMutation } =
  cateBasket
