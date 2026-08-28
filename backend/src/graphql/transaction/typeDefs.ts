export const typeDefs = /* GraphQL */ `
  enum TransactionType {
    INCOME
    EXPENSE
  }

  type Transaction {
    id: ID!
    title: String!
    amountCents: Int!
    type: TransactionType!
    date: String!
    createdAt: String!
    category: Category
  }

  type TransactionPage {
    items: [Transaction!]!
    total: Int!
    page: Int!
    perPage: Int!
  }

  type Summary {
    balanceCents: Int!
    monthIncomeCents: Int!
    monthExpenseCents: Int!
  }

  input TransactionFilterInput {
    search: String
    categoryId: ID
    type: TransactionType
    dateFrom: String
    dateTo: String
  }

  input TransactionCreateInput {
    title: String!
    amountCents: Int!
    type: TransactionType!
    date: String!
    categoryId: ID
  }

  input TransactionUpdateInput {
    title: String
    amountCents: Int
    type: TransactionType
    date: String
    categoryId: ID
  }

  extend type Query {
    transactions(filter: TransactionFilterInput, page: Int, perPage: Int): TransactionPage!
    summary: Summary!
  }

  extend type Mutation {
    createTransaction(input: TransactionCreateInput!): Transaction!
    updateTransaction(id: ID!, input: TransactionUpdateInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`
