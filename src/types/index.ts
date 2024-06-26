import type { ChipPropsColorOverrides } from '@mui/material'
import type { OverridableStringUnion } from '@mui/types'

export type SelectOptions<T = string | number> = {
  value: T
  label: string
  color?: OverridableStringUnion<
    'error' | 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning',
    ChipPropsColorOverrides
  >
}

export * from './category/boss'
export * from './category/warehouse'
export * from './category/product'
export * from './category/supply'
// export * from './input-check/normal'
