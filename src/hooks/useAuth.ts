import { useMemo } from 'react'

import { selectCurrentUser } from '@/redux-store/slices/auth'

import { useAppSelector } from './useToolkit'

export const useAuth = () => {
  const user = useAppSelector(selectCurrentUser)

  return useMemo(() => ({ user }), [user])
}
