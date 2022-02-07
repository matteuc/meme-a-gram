import { User } from '@prisma/client'

export interface AuthContext {
  user?: User
}
