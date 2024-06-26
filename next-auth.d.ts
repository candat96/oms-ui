import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: { address: string } & DefaultSession['user']
  }
}
declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    address: string
  }
}
