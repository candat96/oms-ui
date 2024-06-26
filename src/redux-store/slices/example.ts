import { createSlice } from '@reduxjs/toolkit'

import { db } from '@/data/db/example'

export const exampleSlice = createSlice({
  name: 'example',
  initialState: db,
  reducers: {
    create: (state, action) => {
      console.log({ state, action })
    },
    edit: (state, action) => {
      console.log({ state, action })
    },
    changeStatus: (state, action) => {
      const { id, status } = action.payload
      const data = state.data.find(item => item.id === id)

      if (data) {
        data.status = status
      }
    }
  }
})
export const { create, edit, changeStatus } = exampleSlice.actions
export default exampleSlice.reducer
