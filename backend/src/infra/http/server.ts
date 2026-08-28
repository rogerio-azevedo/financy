import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import mercurius, { type IResolvers } from 'mercurius'
import { env } from '../../env'
import { buildContext } from '../graphql/context'
import { resolvers, schema } from '../graphql/schema'

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: env.CORS_ORIGIN,
})

await app.register(mercurius, {
  schema,
  resolvers: resolvers as IResolvers,
  context: async (request) => buildContext(request),
  graphiql: env.NODE_ENV !== 'production',
})

app.get('/health', async () => ({ ok: true }))

await app.listen({ port: env.PORT, host: '0.0.0.0' })
