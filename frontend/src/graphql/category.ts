import { gql } from '@apollo/client'

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    name
    description
    icon
    color
    createdAt
    transactionCount
    totalCents
  }
`

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CategoryCreateInput!) {
    createCategory(input: $input) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryUpdateInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`
