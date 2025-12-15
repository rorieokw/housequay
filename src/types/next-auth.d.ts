import 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    id: string
    role: UserRole
    isHost: boolean
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      isHost: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    isHost: boolean
  }
}
