import { createYoga } from 'graphql-yoga'
import { PageConfig } from 'next'
import { env } from '~/server/env'
import { schema } from '~/server/gql/schema'
import { YogaServer } from '~/types/yoga'
import { getAuthServerSession } from '~/util/auth'
import { GQLError } from '~/util/gql-error'

export const config: PageConfig = { api: { bodyParser: false } }

const yoga = createYoga<YogaServer>({
  schema: schema,
  graphqlEndpoint: '/api/gql',
  graphiql: env.NODE_ENV === 'development',
  context: async ({ req, res }) => {
    const session = await getAuthServerSession({ req, res })
    if (!session || !session.user) {
      if (env.NODE_ENV === 'development') return { user: {} } // by-pass auth in dev
      throw GQLError(401)
    }
    return { user: session.user }
  },
})

export default yoga
