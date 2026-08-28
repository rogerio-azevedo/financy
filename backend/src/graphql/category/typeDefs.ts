export const typeDefs = /* GraphQL */ `
  type Category {
    id: ID!
    name: String!
    description: String!
    icon: String!
    color: String!
    createdAt: String!
    transactionCount: Int!
    totalCents: Int!
  }

  input CategoryCreateInput {
    name: String!
    description: String
    icon: String!
    color: String!
  }

  input CategoryUpdateInput {
    name: String
    description: String
    icon: String
    color: String
  }

  extend type Query {
    categories: [Category!]!
  }

  extend type Mutation {
    createCategory(input: CategoryCreateInput!): Category!
    updateCategory(id: ID!, input: CategoryUpdateInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`
