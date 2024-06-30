// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

type IProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  locale: string | string[]
}

const useHorizontalMenuData = (props: IProps): HorizontalMenuDataType[] => {
  const { dictionary, locale } = props

  return [
    {
      label: dictionary['navigation'].home,
      href: `${locale}/home`,
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
}

export default useHorizontalMenuData
