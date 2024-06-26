import { configureStore } from '@reduxjs/toolkit'

import { api } from '@/components/base-query/api'
import auth from '@/redux-store/slices/auth'
import example from '@/redux-store/slices/example'

export const store = configureStore({
  reducer: { example, auth, [api.reducerPath]: api.reducer },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
