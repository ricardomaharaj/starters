import { paginateArgs } from '~/server/gql/args/paginate'
import { builder } from '~/server/gql/builder'
import { prisma } from '~/server/prisma'
import { GQLError } from '~/server/util/gql-error'

builder.queryFields((t) => ({
  users: t.prismaField({
    type: ['User'],
    args: {
      ...paginateArgs,
    },
    resolve: async (query, _, { skip, take }) => {
      return await prisma.user.findMany({
        skip: skip ?? 0,
        take: take ?? 10,
        ...query,
      })
    },
  }),
  user: t.prismaField({
    type: 'User',
    args: { userId: t.arg.string({ required: true }) },
    resolve: async (query, _, { userId }) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        ...query,
      })
      if (!user) throw GQLError(404)
      return user
    },
  }),
}))