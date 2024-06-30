// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import NotFound from '@views/NotFound'

// Util Imports
import { getServerMode, getSystemMode } from '@core/utils/serverHelpers'
import { i18n, type Locale } from '@/configs/i18n'

const NotFoundPage = ({ params }: { params: { lang: Locale } }) => {
  // Vars
  const direction = i18n.langDirection[params.lang]
  const mode = getServerMode()
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <NotFound mode={mode} />
      </BlankLayout>
    </Providers>
  )
}

export default NotFoundPage
