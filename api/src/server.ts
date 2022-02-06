import fastify from 'fastify'
import mercurius from 'mercurius'
import mercuriusAuth from 'mercurius-auth'
import { schema } from './schema'
import { context } from './context'

const app = fastify()

app.register(mercurius, {
  schema,
  graphiql: true,
  context: () => context,
})

declare module 'mercurius' {
  // TODO - Revise with user type
  type MercuriusAuthContext = {
    user?: { name: string, id: number }
  }
}

app.register(mercuriusAuth, {
  // TODO - Verify user JWT using auth SDK
  authContext (context) {
    const userId = context.reply.request.headers['x-user'] || ''

    const user = { id: userId, name: 'Anonymous' };

    return { user }
  },
  async applyPolicy (policy, _parent, _args, context, info) {

    if(Boolean(context.auth?.user) !== !policy?.public) {
      return new Error(`User not authenticated to access ${info.fieldName}`)
    }

    return true
  },
  // Enable External Policy mode
  mode: 'external',
  policy: {
    Query: {
      feed: { public: false },
      memeById: { public: false }
    },
    Mutation: {
      signupUser: { public: true },
      createMeme: { public: false }
    }
  }
})

const DEPLOYED_TO_PORT = process.env.PORT || 4000

app.listen(DEPLOYED_TO_PORT, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server ready at: http://localhost:${DEPLOYED_TO_PORT}/graphiql`)
})
