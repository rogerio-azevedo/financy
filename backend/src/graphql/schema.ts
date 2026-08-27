import { typeDefs as rootTypeDefs } from './root'
import { typeDefs as userTypeDefs, resolvers as userResolvers } from './user'
import { typeDefs as categoryTypeDefs, resolvers as categoryResolvers } from './category'
import { typeDefs as transactionTypeDefs, resolvers as transactionResolvers } from './transaction'

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
