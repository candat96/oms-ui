import NextAuth from 'next-auth'

import { authOptions } from '@/configs/authConfigs'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
