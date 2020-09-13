import { gql } from "apollo-server";

module.exports = gql`
  type User {
    _id: ID!
    firstname: String!
    lastname: String!
    address: String!
    phone: String!
    email: String!
    token: String!
    password: String!
    createdAt: String!
    updatedAt: String!
    orders: [Order!]!
  }

  input UserInputData {
    firstname: String!
    lastname: String!
    address: String!
    phone: String!
    email: String!
    password: String!
  }

  type AuthData {
    token: String!
    userId: String!
  }
  type Mutation {
    login(email: String!, password: String!): AuthData!
  }
`;
