import fastify from 'fastify'
import mercurius from 'mercurius'
import mercuriusAuth from 'mercurius-auth'
import { schema } from './schema'
import {
  applyPolicyHandler,
  authContextHandler,
  onResolutionHook,
  preParsingHook,
  setupRequestContext,
} from './utils'
import { AUTH_OBJECT_POLICY, DEPLOYED_TO_PORT } from './constants'

export const buildServer = async () => {
  const app = fastify()

  await app
    .register(require('fastify-cors'))
    .register(mercurius, {
      schema,
      graphiql: true,
      context: setupRequestContext,
    })
    .register(mercuriusAuth, {
      authContext: authContextHandler,
      applyPolicy: applyPolicyHandler,
      // Enable External Policy mode
      mode: 'external',
      policy: AUTH_OBJECT_POLICY,
    })

  app.graphql.addHook('preParsing', preParsingHook)

  app.graphql.addHook('onResolution', onResolutionHook)

  return app
}

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
