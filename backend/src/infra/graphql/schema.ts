import { typeDefs as rootTypeDefs } from '../../graphql/root'
import { typeDefs as userTypeDefs } from '../../graphql/user/typeDefs'
import { resolvers as userResolvers } from '../../graphql/user/resolvers'
import { typeDefs as categoryTypeDefs } from '../../graphql/category/typeDefs'
import { resolvers as categoryResolvers } from '../../graphql/category/resolvers'
import { typeDefs as transactionTypeDefs } from '../../graphql/transaction/typeDefs'
import { resolvers as transactionResolvers } from '../../graphql/transaction/resolvers'

export const schema = [
  rootTypeDefs,
  userTypeDefs,
  categoryTypeDefs,
  transactionTypeDefs,
].join('\n')

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...categoryResolvers.Query,
    ...transactionResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...transactionResolvers.Mutation,
  },
  User: userResolvers.User,
  Category: categoryResolvers.Category,
  Transaction: transactionResolvers.Transaction,
}
