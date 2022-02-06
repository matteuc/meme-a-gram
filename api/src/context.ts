import { PrismaClient } from '@prisma/client'
import { AuthContext } from './types'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
}

export interface CustomContext extends Context {
  auth?: AuthContext
}

export const context: Context = {
  prisma,
}
