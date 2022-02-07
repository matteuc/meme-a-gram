import fastify from 'fastify'
import mercurius from 'mercurius'
import mercuriusAuth from 'mercurius-auth'
import { schema } from './schema'
import { context } from './context'
import crypto from 'crypto'
import { AuthContext } from './types'
import { getUserFromToken } from './utils'

declare module 'mercurius' {
  // TODO - Revise with user type
  type MercuriusAuthContext = AuthContext
}
const buildServer = async () => {
  const app = fastify()

  await app
    .register(require('fastify-cors'))
    .register(mercurius, {
      schema,
      graphiql: true,
      context: () => {
        const requestId = crypto.randomBytes(4).toString('hex')

        return { ...context, requestId }
      },
    })
    .register(mercuriusAuth, {
      async authContext(context) {
        const authToken = context.reply.request.headers['Authentication'] || context.reply.request.headers['authentication'] || ''

        try {

          const user = await getUserFromToken(
            Array.isArray(authToken) ? authToken[0] : authToken,
          )

          return { user }
        } catch(e) {
          console.error({e})
        }

      },
      async applyPolicy(policy, _parent, _args, context, info) {
        if (Boolean(context.auth?.user) !== !policy?.public) {
          return new Error(`User not authenticated to access ${info.fieldName}`)
        }

        return true
      },
      // Enable External Policy mode
      mode: 'external',
      policy: {
        Query: {
          feed: { public: false },
          memeById: { public: false },
        },
        Mutation: {
          signupUser: { public: true },
          createMeme: { public: false },
        },
      },
    })

  app.graphql.addHook('preParsing', async (_schema, source, context) => {
    const stdoutLine = '-'.repeat(process.stdout.columns)

    // @ts-ignore
    const reqId = context.requestId

    console.info(`
${stdoutLine}
Stage: START
Request ID: ${reqId}
User: ${context.auth?.user}
Source: ${source}
${stdoutLine}
`)
  })

  app.graphql.addHook('onResolution', async (execution, context) => {
    const stdoutLine = '-'.repeat(process.stdout.columns)

    // @ts-ignore
    const reqId = context.requestId

    console.info(`
${stdoutLine}
Stage: END
Request ID: ${reqId}
User: ${JSON.stringify(context.auth?.user)}
Result: ${JSON.stringify(execution.data)}
Errors: ${JSON.stringify(execution.errors)}
${stdoutLine}
`)
  })

  return app
}

const DEPLOYED_TO_PORT = process.env.PORT || 4000

buildServer().then((app) =>
  app.listen(DEPLOYED_TO_PORT, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(
      `Server ready at: http://localhost:${DEPLOYED_TO_PORT}/graphiql`,
    )
  }),
)
