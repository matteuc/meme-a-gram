import fastify from 'fastify'
import mercurius from 'mercurius'
import { schema } from './schema'
import { context } from './context'

const app = fastify()

app.register(mercurius, {
  schema,
  graphiql: true,
  context: () => context,
})

const DEPLOYED_TO_PORT = process.env.PORT || 4000

app.listen(DEPLOYED_TO_PORT, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server ready at: http://localhost:${DEPLOYED_TO_PORT}/graphiql`)
})
