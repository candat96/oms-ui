'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import type { getDictionary } from '@/utils/getDictionary'

const DictionaryContext = createContext<{ [key: string]: any } | null>(null)

export const DictionaryProvider = ({
  dictionary,
  children
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  children: ReactNode
}) => {
  return <DictionaryContext.Provider value={dictionary}>{children}</DictionaryContext.Provider>
}

export const useDictionary = () => {
  const context = useContext(DictionaryContext)

  if (context === null) {
    throw new Error('useDictionary must be used within a DictionaryProvider')
  }

  return context
}
