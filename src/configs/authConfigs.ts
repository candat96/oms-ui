import NextAuth from 'next-auth/next'
import CredentialProvider from 'next-auth/providers/credentials'

import type { NextAuthOptions } from 'next-auth'

const user = {
  name: 'Alexander Ahi',
  email: 'alexahi12@gmail.com',
  image: '',
  id: 'c24349e9-2689-4d48-97b3-d93e6b259fd9'
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { username, password } = credentials as { username: string; password: string }

        try {
          // config api login
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/su/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'tenant-code': `${process.env.NEXT_PUBLIC_TENANT}`
            },
            body: JSON.stringify({ username, password })
          })

          const data = await res.json()

          if (res.status === 401) {
            throw new Error(JSON.stringify(data))
          }

          if (res.status === 201) {
            return { address: data.accessToken, ...user }
          }

          return null
        } catch (error: any) {
          throw new Error(error.message)
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // token.name = user.name
        // TODO: change info account
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        token.sub = user.id
        // @ts-ignore
        token.address = user['address']
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name
        session.user.address = token.address
      }

      return session
    }
  }
}

export const { auth } = NextAuth({ ...authOptions })
