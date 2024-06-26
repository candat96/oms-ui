import { toast } from 'react-toastify'

import { api } from '@/components/base-query/api'
import { API_CONSTANT } from '@/components/base-query/base-url'
import { mappingData } from '@/utils/mappingData'
import { MESSAGE } from '@/constants/message-response'
import type { IMapping } from '@/utils/mappingData'

const { API_UNIT } = API_CONSTANT

const cateUnit = api.injectEndpoints({
  endpoints: build => ({
    listUnit: build.query({
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
    })
  })
})

export const { useListUnitQuery, useCreateUnitMutation, useUpdateUnitMutation, useRemoveUnitMutation } = cateUnit
