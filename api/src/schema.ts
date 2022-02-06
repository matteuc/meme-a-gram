import {
  IExecutableSchemaDefinition,
  makeExecutableSchema,
} from '@graphql-tools/schema'
import { DateTimeResolver } from 'graphql-scalars'
import mercurius from 'mercurius'
const { ErrorWithProps } = mercurius
import { ERROR_CODES, MEME_PAGE_SIZE } from './constants'
import { Context } from './context'
import { getImageUrlFromImageRef } from './utils'

export interface MemeCreateInput {
  imageRef: string
  title: string
}

export interface UserCreateInput {
  email: string
  username: string
}

const typeDefs = `
type Mutation {
  createMeme(authorEmail: String!, data: MemeCreateInput!): Meme!
  signupUser(data: UserCreateInput!): User!
}
type Meme {
  id: Int!
  createdAt: DateTime!
  author: User
  title: String
  imageUrl: String!
  imageRef: String
}
input MemeCreateInput {
  imageRef: String
  title: String!
}
type Query {
  feed(lastId: Int, searchString: String): [Meme!]!
  memeById(id: Int): Meme
}
type User {
  email: String
  id: Int!
  username: String!
  memes: [Meme!]
}
input UserCreateInput {
  email: String!
  username: String!
  memes: [MemeCreateInput!]
}
scalar DateTime
`

const resolvers: IExecutableSchemaDefinition['resolvers'] = {
  Query: {
    memeById: (_, args: { id: number }, context: Context) => {
      return context.prisma.meme.findUnique({
        where: { id: args.id || undefined },
      })
    },
    feed: (
      _,
      args: {
        searchString: string
        lastId: number
      },
      context: Context,
    ) => {
      const cursor = args.lastId
        ? {
            id: args.lastId,
          }
        : undefined

      const where = args.searchString
        ? {
            title: { contains: args.searchString },
          }
        : undefined

      return context.prisma.meme.findMany({
        where,
        take: MEME_PAGE_SIZE,
        skip: 1, // skip the last item
        cursor,
      })
    },
  },
  Mutation: {
    signupUser: async (
      _,
      args: { data: UserCreateInput },
      context: Context,
    ) => {
      return context.prisma.user.create({
        data: {
          username: args.data.username,
          email: args.data.email,
        },
      })
    },
    createMeme: async (
      _,
      args: { data: MemeCreateInput; authorEmail: string },
      context: Context,
    ) => {
      const permUrl = await getImageUrlFromImageRef(args.data.imageRef)

      if (!permUrl) {
        throw new ErrorWithProps(ERROR_CODES.MEME_REF_INVALID.message, {
          ref: args.data.imageRef,
          code: ERROR_CODES.MEME_REF_INVALID.code,
          timestamp: new Date().getTime(),
        })
      }

      return context.prisma.meme.create({
        data: {
          title: args.data.title,
          imageRef: args.data.imageRef,
          imageUrl: permUrl,
          author: {
            connect: { email: args.authorEmail },
          },
        },
      })
    },
  },
  DateTime: DateTimeResolver,
  Meme: {
    author: (parent, _args, context: Context) => {
      return context.prisma.meme
        .findUnique({
          where: { id: parent?.id },
        })
        .author()
    },
  },
  User: {
    memes: (parent, _args, context: Context) => {
      return context.prisma.user
        .findUnique({
          where: { id: parent?.id },
        })
        .memes()
    },
  },
}

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
})
