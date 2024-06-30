// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { ChildrenType } from '@core/types'
import { i18n, type Locale } from '@configs/i18n'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import ScrollToTop from '@core/components/scroll-to-top'

// Util Imports
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import Customizer from '@/@core/components/customizer'
import { getDictionary } from '@/utils/getDictionary'
import { DictionaryProvider } from '@/hooks/DictionaryContext'

const Layout = async ({ children, params }: ChildrenType & { params: { lang: Locale } }) => {
  // Vars
  const direction = i18n.langDirection[params.lang]

  const dictionary = await getDictionary(params.lang)

  const mode = getMode()
  const systemMode = getSystemMode()

  return (
    <DictionaryProvider dictionary={dictionary}>
      <Providers direction={direction}>
        <LayoutWrapper
          systemMode={systemMode}
          verticalLayout={
            <VerticalLayout
              navigation={<Navigation dictionary={dictionary} mode={mode} systemMode={systemMode} />}
              navbar={<Navbar />}
              footer={<VerticalFooter />}
            >
              {children}
            </VerticalLayout>
          }
          horizontalLayout={
            <HorizontalLayout header={<Header dictionary={dictionary} />} footer={<HorizontalFooter />}>
              {children}
            </HorizontalLayout>
          }
        />
        <ScrollToTop className='mui-fixed'>
          <Button
            variant='contained'
            className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
          >
            <i className='ri-arrow-up-line' />
          </Button>
        </ScrollToTop>
        <Customizer dir={direction} />
      </Providers>
    </DictionaryProvider>
  )
}

export default Layout
