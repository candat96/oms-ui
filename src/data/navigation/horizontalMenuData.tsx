// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Home-hori',
    href: '/home',
    icon: 'ri-home-smile-line',
    children: []
  },
  {
    label: 'About',
    href: '/about',
    icon: 'ri-information-line',
    children: []
  }
]

export default horizontalMenuData
