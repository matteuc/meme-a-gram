import {
  IExecutableSchemaDefinition,
  makeExecutableSchema,
} from '@graphql-tools/schema'
import { DateTimeResolver } from 'graphql-scalars'
import mercurius from 'mercurius'
import { BUCKET_FOLDERS, ERROR_CODES, MEME_PAGE_SIZE } from './constants'
import { CustomContext } from './context'
import { getImageUrlFromImageRef, getStorageBucketUploadUrl } from './utils'
const { ErrorWithProps } = mercurius

export interface MemeCreateInput {
  imageRef: string
  imageType: string
  title: string
}

export interface UserCreateInput {
  email: string
  username: string
}

export interface FileUploadInput {
  fileName: string
  fileType: string
}

const typeDefs = `
type Mutation {
  createMeme(data: MemeCreateInput!): Meme!
  signupUser(data: UserCreateInput!): User!
}
type Meme {
  id: Int!
  createdAt: DateTime!
  author: User
  title: String
  imageUrl: String!
  imageRef: String
  imageType: String
}
input MemeCreateInput {
  imageRef: String!
  imageType: String!
  title: String!
}
type FileUploadUrlConfig {
  url: String!
  key: String!
}
type Query {
  feed(lastId: Int, searchString: String): [Meme!]!
  memeById(id: Int): Meme
  getFileUploadUrl(data: FileUploadInput!): FileUploadUrlConfig!
  getCurrentUser(): User!
}
type User {
  email: String
  id: Int!
  username: String!
  memes: [Meme!]
}
input UserCreateInput {
  username: String!
  memes: [MemeCreateInput!]
}
scalar DateTime
input FileUploadInput {
  fileName: String!
  fileType: String!
}
`

const resolvers: IExecutableSchemaDefinition['resolvers'] = {
  Query: {
    memeById: (_, args: { id: number }, context: CustomContext) => {
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
      context: CustomContext,
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
        skip: cursor ? 1 : 0, // skip the last item if cursor specified
        cursor,
        orderBy: {
          createdAt: 'desc',
        },
      })
    },
    getFileUploadUrl: async (
      _,
      args: { data: FileUploadInput },
      context: CustomContext,
    ) => {
      const userId = context.auth?.user?.id

      if (!userId) {
        throw new ErrorWithProps(ERROR_CODES.NOT_AUTH.message, {
          code: ERROR_CODES.NOT_AUTH.code,
          timestamp: new Date().getTime(),
        })
      }

      const putUrl = await getStorageBucketUploadUrl(
        userId.toString(),
        args.data.fileName,
        args.data.fileType,
        BUCKET_FOLDERS.users,
      )

      return {
        url: putUrl.url,
        key: putUrl.key,
      }
    },
    getCurrentUser: async (
      _,
      _args,
      context: CustomContext,
    ) => {
      const currUser = context.auth?.user

      if (!currUser) {
        throw new ErrorWithProps(ERROR_CODES.NOT_AUTH.message, {
          code: ERROR_CODES.NOT_AUTH.code,
          timestamp: new Date().getTime(),
        })
      }

      return currUser
    } 
  },
  Mutation: {
    signupUser: async (
      _,
      args: { data: UserCreateInput },
      context: CustomContext,
    ) => {
      
      if(context.auth?.user) {
        throw new Error('This user already has an account.')
      }

      if(!context.auth?.userEmail) {
        throw new Error('This user\'s authentication information was not found.')
      }

      return context.prisma.user.create({
        data: {
          username: args.data.username,
          email: context.auth.userEmail,
        },
      })
    },
    createMeme: async (
      _,
      args: { data: MemeCreateInput },
      context: CustomContext,
    ) => {
      if (!context.auth?.user?.email) {
        throw new Error('User "email" not found when creating a meme.')
      }

      const permUrl = await getImageUrlFromImageRef(
        args.data.imageRef,
        args.data.imageType,
      )

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
          imageType: args.data.imageType,
          author: {
            connect: { email: context.auth.user.email },
          },
        },
      })
    },
  },
  DateTime: DateTimeResolver,
  Meme: {
    author: (parent, _args, context: CustomContext) => {
      return context.prisma.meme
        .findUnique({
          where: { id: parent?.id },
        })
        .author()
    },
  },
  User: {
    memes: (parent, _args, context: CustomContext) => {
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
