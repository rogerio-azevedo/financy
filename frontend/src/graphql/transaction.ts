import { gql } from '@apollo/client'

export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    title
    amountCents
    type
    date
    createdAt
    category {
      id
      name
      icon
      color
    }
  }
`

export const TRANSACTIONS_QUERY = gql`
  query Transactions($filter: TransactionFilterInput, $page: Int, $perPage: Int) {
    transactions(filter: $filter, page: $page, perPage: $perPage) {
      items {
        ...TransactionFields
      }
      total
      page
      perPage
    }
  }
  ${TRANSACTION_FIELDS}
`

export const SUMMARY_QUERY = gql`
  query Summary {
    summary {
      balanceCents
      monthIncomeCents
      monthExpenseCents
    }
  }
`

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction($input: TransactionCreateInput!) {
    createTransaction(input: $input) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`

export const UPDATE_TRANSACTION_MUTATION = gql`
  mutation UpdateTransaction($id: ID!, $input: TransactionUpdateInput!) {
    updateTransaction(id: $id, input: $input) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`

export const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`
